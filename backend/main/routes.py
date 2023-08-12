from main import app, db
from flask import jsonify, request, abort, send_file
from .models import Video, GeneratedTranscript, transcript
from werkzeug.utils import secure_filename
from moviepy.editor import VideoFileClip

import os

@app.route("/api/add_transcript", methods=['POST'])
def add_transcript():
    """
    Endpoint for adding a transcript to a video.

    This route allows users to add a transcript to a specified video, including the transcript's start time, text content,
    and optionally, end time. The provided video title is used to identify the video to which the transcript belongs.
    The transcript information is extracted from the JSON payload of the POST request and then stored in the database.

    Parameters:
        None (Parameters are extracted from the JSON payload of the POST request)

    Returns:
        dict: A JSON response indicating the success status of the operation.
            - "success": True if the transcript addition was successful, otherwise False.
    
    Raises:
        404 Error: If any of the required parameters (video_title, start_time, text) are missing in the request payload.

    Example JSON Payload:
    {
        "video_title": "my_video_2.mp4",
        "start_time": 10.5,
        "end_time": 20.0,
        "text": "This is a sample transcript."
    }
    """
    # get variables
    video_title = request.get_json()['video_title']
    if video_title is None:
        abort(404, description="Video title not found!")

    start_time = request.get_json()['start_time']
    if start_time is None:
        abort(404, description="Start time not found!")
    
    text = request.get_json()['text']
    if text is None:
        abort(404, description="Text not found!")

    end_time = request.get_json()['end_time']

    video = Video.query.filter_by(video_title=video_title).first_or_404()
    new_transcript = transcript(video_id = video.id, start_time = float(start_time), end_time = float(end_time), text = text)
    db.session.add(new_transcript)
    db.session.commit()

    return jsonify({"success":True})

@app.route("/api/add_video", methods=['POST'])
def add_video():
    """
    Endpoint for adding a video file and its information.

    This route allows users to upload a video file and associate it with metadata in the database. The uploaded video file
    is stored in the designated directory, and its metadata (video title) is added to the database.

    Parameters:
        None (Parameters are extracted from the POST request)

    Returns:
        dict: A JSON response containing the newly assigned video title that it is saved as to prevent overwritting other files.
            - "video_title": The title assigned to the uploaded video.

    Raises:
        404 Error: If the uploaded video file is not found in the request.

    Example Usage:
        POST request with a video file named "my_video.mp4"
        Response: {"video_title": "my_video_2.mp4"}
    """

    # get video file from request
    video_file = request.files['video']
    if video_file is None:
        abort(404, description="Video file not found!")
    
    # save video to storage/file
    file_name = secure_filename(video_file.filename)
    file_path = os.path.join("main", "user_data", "videos" , file_name)
    file_path, file_name = find_available_file(file_path=file_path)
    video_file.save(file_path)

    # add to database
    video = Video(video_title = file_name)
    db.session.add(video)
    db.session.commit()
    
    # return new video title
    return jsonify({"video_title": file_name})    

@app.route("/api/generate_transcript", methods=['POST'])
def generate_transcript():
    """
    Endpoint for generating a transcript file for a video.

    This route generates a transcript file in .vtt format for a specified video, based on the provided transcript data
    and video information. The transcript is generated from the database records and then saved to a designated directory.
    The generated transcript is associated with the video in the database.

    Parameters:
        None (Parameters are extracted from the JSON payload of the POST request)

    Returns:
        file: The generated transcript file in .vtt format.

    Raises:
        404 Error: If the video title is not found in the request or if any error occurs during transcript generation.

    Example JSON Payload:
    {
        "video_title": "my_video_2.mp4"
    }
    """
    # get variables
    data = request.get_json(silent=True)

    video_title =  data.get('video_title')
    if video_title is None:
        abort(404, description="Video title not found!")

    # get data from database
    video = Video.query.filter_by(video_title=video_title).first_or_404()
    db_transcripts = transcript.query.filter_by(video_id=video.id).all()
    
    # get video path
    video_path = os.path.join("main", "user_data", "videos" , video_title)

    # get file_path
    path, base_name, extension = split_file_path(os.path.join("main", "user_data", "transcripts" , video_title))
    transcript_title = base_name+'.vtt'
    transcript_path = os.path.join(path, transcript_title)

    # handle transcripts for generating video
    transcripts=[]
    for t in db_transcripts:
        transcripts.append([t.start_time, t.end_time, t.text])
    
    # handle end time being empty or overlaping next transcript
    has_errors = ensure_transcript_integrity(transcripts, video_path)
    if has_errors:
        abort(404,  description="Transcripts are overlapping!")

    # generate transcript file
    generate_transcript_file(transcripts=transcripts, filepath=transcript_path)

    # add to database
    generated_transcript = GeneratedTranscript(transcript_title = transcript_title)    
    db.session.add(generated_transcript)
    db.session.commit()

    # update Video in database
    generated_transcript = GeneratedTranscript.query.filter_by(transcript_title=transcript_title).first_or_404()
    Video.query.filter_by(id=video.id).update(dict(generated_transcript_id = generated_transcript.id))
    db.session.commit()

    # return the generated video file. The path for send_file function must be relative to current file and not root directory.
    generated_transcript_path = os.path.join("user_data", "transcripts" , transcript_title)
    return send_file(generated_transcript_path)

def find_available_file(file_path):
    """
    Find an available filename by appending a numeric suffix.

    This function takes a file path as input and appends a numeric suffix to the file name (before the extension) if the
    initial file name is already taken. It checks if the file path exists and, if so, iterates through appending
    incremental numeric suffixes until an available file name is found.

    Parameters:
        file_path (str): The original path of the file.

    Returns:
        tuple: A tuple containing the full path of the available file and its corresponding new file name.

    Example Usage:
        original_file_path = "path/to/myfile.txt"
        available_path, new_file_name = find_available_file(original_file_path)
    """

    suffix = 1
    dir, file_name, extension = split_file_path(file_path)
    if not os.path.exists(file_path):
        return file_path, file_name+extension
    while True:
        new_file_name = add_suffix(file_path=file_path, suffix=suffix)
        full_file_path = os.path.join(dir, new_file_name)
        if not os.path.exists(full_file_path):
            return full_file_path, new_file_name
        suffix +=1

def split_file_path(file_path):
    """
    Split a file path into directory, file name without extension, and file extension.

    This function takes a file path as input and splits it into its components: the directory path, the file name without
    extension, and the file extension. It extracts the necessary parts to facilitate handling file paths.

    Parameters:
        file_path (str): The full path of the file, including directory and file name.

    Returns:
        tuple: A tuple containing the directory path, the file name without extension, and the file extension.

    Example Usage:
        full_file_path = "/path/to/myfile.txt"
        dir_path, filename, extension = split_file_path(full_file_path)
    """
    directory_path = os.path.dirname(file_path)
    file_name_without_extension = os.path.splitext(os.path.basename(file_path))[0]
    file_extension = os.path.splitext(file_path)[1]
    
    return directory_path, file_name_without_extension, file_extension

def add_suffix(file_path, suffix):
    """
    Add a provided suffix to the file name while keeping path and extension consistent.

    This function takes a file path, appends a numeric suffix to the file name (before the extension), and returns the
    new file name. It ensures that the directory path and file extension remain consistent in the returned file path.

    Parameters:
        file_path (str): The original path of the file.
        suffix (int): The numeric suffix to be added to the file name.

    Returns:
        str: The new file name with the added numeric suffix.

    Example Usage:
        original_file_path = "/path/to/myfile.txt"
        new_filename = add_suffix(original_file_path, 2)  # Returns "myfile_2.txt"
    """
    # Split the original file path into directory, base name, and extension
    directory, base_name, extension = split_file_path(file_path)
    new_file_name = f"{base_name}_{suffix}{extension}"

    return new_file_name

def ensure_transcript_integrity(transcript, path):
    """
    Ensure the integrity of transcript time intervals.

    This function ensures the integrity of time intervals within a transcript list to prevent overlapping or inconsistent
    time segments. It iterates through the transcript list and, if necessary, adjusts the end time of a transcript to
    align with the start time of the next transcript. It also checks for any overlap between adjacent transcript times. 
    It also converts end times and start times from seconds to "HH:MM:SS,MIS", where "MIS" stands for milliseconds.

    Parameters:
        transcript (list): A list of transcript segments, where each segment is represented as [start_time, end_time, text].
        path (str): The path of the video file.

    Returns:
        bool: True if transcript time intervals are overlapping, otherwise False.

    Example Usage:
        transcript_list = [
            [0.0, 5.0, "Hello"],
            [5.1, -1.0, "World"],
        ]
        has_overlap = ensure_transcript_integrity(transcript_list, "path/to/video.mp4")
    """
    for current in range(0, len(transcript)):
        # If the current transcript doesnt have a end time 
        if transcript[current][1] == -1.0:
            # if it is not the last transcript
            if current+1 < len(transcript):
                # current end time will be the next transcripts start time
                transcript[current][1] = transcript[current+1][0]
            else:
                # else the current end time will be the video end.
                transcript[current][1] = get_video_duration(path)
        else:
            # if the end time exists, ensure it is not overlaping next transcript.
            if current+1 < len(transcript):
                if transcript[current][1] > transcript[current+1][0]:
                    return True
                
        # convert format
        transcript[current][0] = time_to_str(transcript[current][0])
        transcript[current][1] = time_to_str(transcript[current][1])
    
    # if transcripts are not overlaping, return false.
    return False

def time_to_str(time):
    """
    Convert a given time in seconds to the format "hours : minutes : seconds, milliseconds".

    Args:
        time (float): The time duration in seconds.

    Returns:
        str: The formatted time string in the format "hours : minutes : seconds, milliseconds".
    """
    hours = int(time // 3600)
    minutes = int((time % 3600) // 60)
    seconds = int(time % 60)
    milliseconds = int((time - int(time)) * 1000)
    
    time_format = f"{hours:02d}:{minutes:02d}:{seconds:02d}.{milliseconds:03d}"
    return time_format

def get_video_duration(path):
    """
    Get the duration of a video file.

    This function uses the `VideoFileClip` class from the `moviepy.editor` module to extract and return the duration
    of a video file in seconds. It opens the video clip, retrieves its duration, and then closes the clip.

    Parameters:
        path (str): The path of the video file.

    Returns:
        float: The duration of the video in seconds.

    Example Usage:
        video_path = "path/to/video.mp4"
        duration = get_video_duration(video_path)
    """
    video_clip = VideoFileClip(path)
    duration = video_clip.duration
    video_clip.close()
    return duration

def generate_transcript_file(transcripts, filepath):
    """
    Generate a .vtt transcript file from a list of transcripts.

    This function takes a list of transcripts, where each transcript includes a start time, end time, and text content.
    It generates a .vtt (Web Video Text Tracks) subtitle file format based on the provided transcripts and saves it at
    the specified file path.

    Args:
        transcripts (list): A list of transcripts, each containing [start_time, end_time, text].
        filepath (str): The file path to save the generated transcript file.

    Example Usage:
        transcripts_list = [
            [10.0, 15.0, "Hello, this is the first part."],
            [18.5, 22.0, "And here's the second part."]
        ]
        transcript_file_path = "path/to/generated_transcript.vtt"
        generate_transcript_file(transcripts_list, transcript_file_path)
    """
    with open(filepath, "w") as f:
        f.write(f"WEBVTT\n\n")
        for transcript in transcripts:
            f.write(f"{transcript[0]} --> {transcript[1]}\n")
            f.write(f"{transcript[2]}\n\n")