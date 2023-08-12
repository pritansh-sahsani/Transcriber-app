from main import app, db
from flask import jsonify, request, abort, send_file
from .models import Video, GeneratedVideo, transcript
from werkzeug.utils import secure_filename
import cv2
import numpy as np

import os

# route for adding a transcript. 
# Requires start time and transcript and optionaly takes end time as parameters. 
@app.route("/api/add_transcript", methods=['POST'])
def add_transcript():
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
    # get video file from request
    video_file = request.files['video']
    if video_file is None:
        abort(404, description="Video file not found!")
    
    # save video to storage/file
    file_name = secure_filename(video_file.filename)
    file_path = os.path.join("main", "user_data", "videos" , file_name)
    file_name, file_path, extension = find_available_file(file_path=file_path, file_name=file_name)
    video_file.save(file_path)

    # add to database
    file_name = file_name + extension
    video = Video(video_title = file_name)
    db.session.add(video)
    db.session.commit()
    
    # return new video title
    return jsonify({"video_title": file_name})    

@app.route("/api/generate_video", methods=['POST'])
def generate_video():
    # get variables
    data = request.get_json(silent=True)

    video_title =  data.get('video_title')
    if video_title is None:
        abort(404, description="Video title not found!")
    
    font_size =  data.get('font_size')
    line_thickness =  data.get('line_thickness')
    color = tuple( data.get('color'))
    bg_color = tuple( data.get('bg_color'))
    bg_transparency =  data.get('bg_transparency')

    # get data from database
    video = Video.query.filter_by(video_title=video_title).first_or_404()
    video_path = os.path.join("main", "user_data", "videos" , video_title)
    new_video_path = os.path.join("main", "user_data", "generated_videos" , video_title)   
    db_transcripts = transcript.query.filter_by(video_id=video.id).all()
    transcripts=[]
    for t in db_transcripts:
        transcripts.append((t.start_time, t.end_time, t.text))
    
    # edit video
    add_transcripts_to_video(video_path=video_path, new_video_path=new_video_path, transcripts=transcripts, font_size=font_size, line_thickness=line_thickness, color=color, bg_color=bg_color, bg_transparency=bg_transparency)
    
    # add to database
    generated_video = GeneratedVideo()

    return send_file(os.path.join("user_data", "generated_videos" , video_title))

def find_available_file(file_path, file_name):
    suffix = 1
    file_name, extension = os.path.splitext(file_name)
    if not os.path.exists(file_path):
        return file_name, file_path, extension
    while True:
        new_file_path, new_file_name, extension = add_suffix(file_path=file_path, suffix=suffix)
        if not os.path.exists(new_file_path):
            return new_file_name+"_"+str(suffix), new_file_path, extension
        suffix +=1

def add_suffix(file_path, suffix):
    
    """ add a provided suffix to the file name while keeping path and file extension consistent."""
    # Split the original file path into directory, base name, and extension
    directory, old_base_name = os.path.split(file_path)
    base_name, extension = os.path.splitext(old_base_name)

    # Create the new file path by combining the directory, new file name, and extension
    new_file_path = os.path.join(directory, f"{base_name}_{suffix}{extension}")

    return new_file_path, base_name, extension

def add_transcripts_to_video(video_path, new_video_path, transcripts, font_size, line_thickness, color, bg_color, bg_transparency):
    """Adds transcripts to a video file.

    Args:
        video_path: The path to the input video file.
        new_video_path: The path to the ouput video file.
        transcripts: A list of transcripts, each of which is a tuple of (start_time, end_time, text).
        
        config variables:
        font_size: size of font.
        line_thickness: line height.
        color: text color (r,g,b).
        bg_color: background color (r,g,b), None for transparent.
        bg_transparency: transparency for background if bg_color is provided. 1 is opaque, 0 is transparent.


    Returns:
        The path to the new video file with the transcripts added.
    """

    import cv2
    import numpy as np

    video = cv2.VideoCapture(video_path)
    width = int(video.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(video.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    output_video = cv2.VideoWriter(new_video_path , fourcc, video.get(cv2.CAP_PROP_FPS), (width, height))

    for start_time, end_time, text in transcripts:
        start_frame = int(start_time * video.get(cv2.CAP_PROP_FPS))
        end_frame = int(end_time * video.get(cv2.CAP_PROP_FPS))

        for frame_num in range(0, int(video.get(cv2.CAP_PROP_FRAME_COUNT))):
            success, frame = video.read()
            if not success:
                break

            if frame_num >= start_frame and frame_num <= end_frame:
                font = cv2.FONT_HERSHEY_SIMPLEX

                
                # Create a copy of the frame to draw the text and bg
                frame_with_text = frame.copy()

                # Get the size of the text to calculate the bg rectangle dimensions
                text_width, text_height  = cv2.getTextSize(text, font, font_size, line_thickness)[0]

                # Calculate bg rectangle dimensions
                bg_width = text_width + 20  # Adding some padding
                bg_height = text_height + 20

                bg_p1 = (int((width-bg_width)/2), height - 20 - bg_height)
                bg_p2 = (int((width+bg_width)/2), height - 20)

                # Calculate the position to center the text within the bg rectangle
                text_x = bg_p1[0] + 10
                text_y = bg_p1[1] + 10 + text_height

                # Draw the bg rectangle
                if bg_color is not None:
                    cv2.rectangle(frame_with_text, bg_p1, bg_p2, bg_color, -1)
                    # Combine the frame with the text and the original frame
                    frame = cv2.addWeighted(frame, 1-bg_transparency, frame_with_text, bg_transparency, 0)

                # Draw the centered text on top of the bg rectangle
                cv2.putText(frame, text, (text_x, text_y), font, font_size, color, line_thickness, cv2.LINE_AA)


            output_video.write(frame)

    video.release()
    output_video.release()