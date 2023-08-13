
# Transcriber App
This web application can be used to easily and seamlessly add transcripts to a video and get them as downloadable files. The primary focus on this is a great UI that provides several methods to make the users job easier to add subtitles as discussed below, along with a API that integrates smoothly with the application. This application is made with Vue.js and flask. 
## Project setup
frontend:
```
cd frontend
npm install
npm run serve //run command
```
backend
```
cd backend
python -m venv \venv
venv\Scripts\activate
pip install -r requirements.txt
python run.py runserver
```
## Backend
### add_transcript() : "/api/add_transcript"
Endpoint for adding a transcript to a video.  

This route allows users to add a transcript to a specified video, including the transcript's start time, text content,

and optionally, end time. The provided video title is used to identify the video to which the transcript belongs.

The transcript information is extracted from the JSON payload of the POST request and then stored in the database.

  

Parameters:

None (Parameters are extracted from the JSON payload of the POST request)

  

Returns:

dict: A JSON response indicating the success status of the operation.  "success": True if the transcript addition was successful, otherwise False.

Raises:

404 Error: If any of the required parameters (video_title, start_time, text) are missing in the request payload.

### delete_transcript() : "/api/delete_transcript"

Delete a transcript entry from the database based on the provided transcript ID.

  

This function processes a JSON POST request to delete a transcript entry from the database.

The transcript ID is extracted from the request JSON. If the transcript ID is not found in the request,

a 404 error is raised. The function queries the database for the transcript with the provided ID,

and if it exists, the transcript entry is deleted from the database and the changes are committed.

A success status is returned as a JSON response upon successful deletion.

  

Returns:

A JSON response indicating the success of the deletion operation:

{"success": true}

  

Raises:

404: If the transcript ID is not found in the request data or if no transcript exists with the provided ID.

### add_video() : "/api/add_video"
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

### generate_transcript() : "/api/generate_transcript"
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

### get_titles() : "/api/get_titles"
Retrieve video titles and corresponding generated transcript titles for a given user IP address.

  

This endpoint processes a POST request containing user data to retrieve a list of video titles

associated with a specific user's IP address. If the user's IP address is not found in the request data,

a 404 error is raised. The endpoint queries the database for videos associated with the provided IP

address, and if any videos are found, it fetches their titles and corresponding generated transcript titles

(if available). The result is returned as a JSON object.

  

Returns:

A JSON response containing video titles and corresponding generated transcript titles (if available).

The response format is as follows:

{"video_title_1": "transcript_title_1", "video_title_2": "transcript_title_2",...}

If no videos are associated with the provided user IP address, the response will be:

{"videos": null}

Raises:

404: If the user IP address is not found in the request data.
### download_transcript() : "/api/download_transcript"
Download a generated transcript file based on the provided transcript title.

  

This endpoint handles a POST request to download a generated transcript file from the server.

The transcript title is extracted from the request JSON. If the transcript title is not found in the request,

a 404 error is raised. The function queries the database for the generated transcript with the provided title.

If the transcript exists, its file path is determined, and the file is sent to the client for download.

  

Returns:

A file download response containing the requested transcript file.

  

Raises:

404: If the transcript title is not found in the request data or if no generated transcript exists with the provided title.

### get_video() : "/api/get_video"
Retrieve and serve a video file based on the provided video title.

  

This endpoint handles a POST request to retrieve and serve a video file from the server.

The video title is extracted from the request JSON. If the video title is not found in the request,

a 404 error is raised. The function queries the database for the video with the provided title.

If the video exists, its file path is determined, and the file is sent to the client for streaming or download.

  

Returns:

A video file response allowing the client to stream or download the requested video.

  

Raises:

404: If the video title is not found in the request data or if no video exists with the provided title.

### find_available_file()
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

### split_file_path()
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

### add_suffix
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

new_filename = add_suffix(original_file_path, 2) # Returns "myfile_2.txt"

### ensure_transcript_integrity()
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

### time_to_str()
Convert a given time in seconds to the format "hours : minutes : seconds, milliseconds".

  

Args:

time (float): The time duration in seconds.

  

Returns:

str: The formatted time string in the format "hours : minutes : seconds, milliseconds".

### get_video_duration()
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

### generate_transcript_file Generate a .vtt transcript file from a list of transcripts.
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

##  Frontend
### IndexPage : index.vue
This Vue component provides a comprehensive interface for uploading videos, adding transcripts, generating transcripts, and displaying the generated transcript with video previews. The component utilizes Axios for making API requests, manages time-related calculations, and updates the UI based on user interactions. It combines HTML, CSS, and JavaScript to create a user-friendly transcribing tool. Let's break down its flow and functionality step by step:

1.  **Template Section:** The template section contains the HTML structure of the component, defining the layout and elements to be displayed.
    
    -   The component is enclosed in a `<div>` with the `id="home_page"`.
    -   There are multiple `<div>` elements with `v-show` directives controlling their visibility based on certain conditions. These divs represent different stages of interaction with the component: `show_initial_frame`, `show_preview`, `show_waiting`, and `show_generated`.
    -   Various HTML elements are used to display information, videos, input fields, buttons, and icons.
2.  **Script Section:** The script section contains the logic of the component, defining its behavior and interactions.
    
    -   The `import` statements at the top import necessary modules, including Axios for making HTTP requests and the `saveAs` function from 'file-saver' for downloading files.
    -   The `export default` block defines the Vue component with its associated data, methods, and lifecycle hooks.
3.  **Data:** The `data` function returns an object that holds the component's reactive data properties.
    
    -   The properties control the visibility of different sections, track the uploaded video file, manage transcript entries, track user IP, and more.
4.  **Mounted Hook:** The `mounted` hook is executed when the component is mounted on the DOM.
    
    -   The hook initializes video playback and tracks the current time of video previews using event listeners.
    -   It retrieves the user's IP address using an external API call.
    -   If a `title_from_user` parameter is present in the route, the component fetches a previously uploaded video.
5.  **Methods:** The `methods` section defines various functions that handle the component's functionality.
    
    -   `handleFileUpload`: Handles file uploads, verifies the file type, and previews the video.
    -   `previewVideo`: Displays the uploaded video in the preview section.
    -   `uploadVideo`: Uploads the video to a server using Axios.
    -   `addTranscript`: Adds a transcript entry based on user input.
    -   `ToggleEnd`: Toggles the end input between active and inactive states.
    -   `timeInputEnd` and `timeInputStart`: Update video preview times based on user input.
    -   `isValidTimeFormat`, `timeToStr`, `strToTime`, and `toTwoDigitString`: Utility functions for time format conversion and validation.
    -   `AddTranscriptToAPI`: Adds a transcript entry to the API.
    -   `generateTranscript`: Initiates transcript generation based on added transcript entries.
    -   `downloadTranscript`: Downloads the generated transcript.
    -   `editTranscript` and `deleteTranscript`: Functions for editing and deleting transcript entries.
    -   `generatePreviouslyUploaded` and `setupPreviouslyUploaded`: Fetches and displays a previously uploaded video.
    -   `displayPreview`, `displayGenerated`, and `displayWaiting`: Functions to toggle the visibility of different sections based on the component's state.

### UserPage : user.vue
This Vue component provides a user interface to display uploaded videos and their generated transcripts. It fetches data from an API, handles user interactions to download transcripts, and displays messages based on the presence or absence of uploads. The component utilizes Axios for API requests and the 'file-saver' library for downloading files.

1.  **Template Section:** The template defines the layout and elements that will be displayed based on the component's data properties:
    
    -   The component consists of multiple `<div>` elements with `v-show` directives controlling their visibility based on certain conditions: `show_initial_frame`, `show_table`, and `show_no_uploads`.
    -   Inside the `show_table` div, there's a table displaying video titles and their generated status or download buttons.
    -   If there are no uploads, the `show_no_uploads` div displays a message indicating the absence of uploads.
2.  **Script Section:** The script section defines the component's logic, including data properties, methods, and lifecycle hooks.
    
    -   The `import` statements at the top import necessary modules, including Axios for making HTTP requests and the `saveAs` function from 'file-saver' for downloading files.
    -   The `export default` block defines the Vue component with its associated data, methods, and lifecycle hooks.
3.  **Data:** The `data` function returns an object containing the component's reactive data properties.
    
    -   Properties control the visibility of different sections, track the user's IP address, manage video titles and their generated status, and more.
4.  **Mounted Hook:** The `mounted` hook is executed when the component is mounted on the DOM.
    
    -   The hook initializes by getting the user's IP address and then proceeds to display the user's uploaded video generations.
5.  **Methods:** The `methods` section contains functions that handle various functionalities of the component.
    
    -   `get_user_ip`: Fetches the user's IP address using an external API.
    -   `display_user_generations`: Retrieves user-generated titles and their status from the API.
    -   `downloadTranscript`: Downloads a transcript using Axios and the `file-saver` library.
    -   `generatePreviouslyUploaded`: Fetches a previously uploaded video using its title.
    -   `display_table`: Controls the visibility of different sections based on data properties.