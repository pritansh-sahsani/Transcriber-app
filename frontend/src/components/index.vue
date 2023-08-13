<template>
  <div id="home_page">		
    <h1>Transcriber</h1><hr>

    <!-- initial frame div -->
    <div v-show="show_initial_frame">
      <p>upload a video file to transcribe</p>
      <div class="custom-file">
        <input type="file" class="custom-file-input" id="validatedCustomFile" @change="handleFileUpload" required>
        <label class="custom-file-label" for="validatedCustomFile">{{ file_name }}</label>
        <div class="invalid-feedback">Example invalid custom file feedback</div>
      </div>
    </div>

    <!-- preview and adding transcript div -->
    <div v-show="show_preview">
      <p>You can add transcripts from the inputs or directly from the video previews.<br>disabling end time will automatically display the transcript till the next transcript is displayed.<br>Make sure transcripts do not overlap!</p>
      <!-- video previews -->
      <div class="video_previews">
        <div>
          <h3 id="start_preview_title">Start Frame</h3>
          <h3 id="end_preview_title" v-show="end_enabled">End Frame</h3>
        </div>
        <div>
          <video id="video_preview_start" ref="video_start" controls></video>
          <video id="video_preview_end" ref="video_end" v-show="end_enabled" controls></video>
        </div>
      </div>
      
      <!-- table for displaying current transcript -->
      <table class="table" v-show="show_table">
        <thead class="thead-light">
          <tr>
            <th scope="col" class="column">Start</th>
            <th scope="col" class="column">End</th>
            <th scope="col" class="column">transcript</th>
            <th scope="col" class="icon_column">Edit</th>
            <th scope="col" class="icon_column">Delete</th>
          </tr>
        </thead>
        <thead>
          <tr v-for="transcript in transcription" :key="transcript[0]+'_div'" :class="transcript[0]">
            <td>
              {{transcript[1]}}
            </td>
            <td>
              {{transcript[2]}}
            </td>
            <td>
              {{transcript[3]}}
            </td>
            <td>
              <img class="edit_icon" :id="transcript[0]" @click="editTranscript" src="../assets/edit_icon.svg">
            </td>
            <td>
              <img class="delete_icon" :id="transcript[0]" @click="deleteTranscript" src="../assets/delete_icon.svg">
            </td>
          </tr>
        </thead>
      </table>

      <!-- form for getting transcript --> 
      <div class="transcript-form">
        <input id="time_start_input" ref="time_start" class="form-control" @change="timeInputStart">
        <input id="time_end_input" ref="time_end" class="form-control" placeholder="End time is disabled." @change="timeInputEnd" :readonly="!end_enabled">

        <input id="end_active_input" ref="end_active_input" class="checkbox-input" type="checkbox" checked @click="ToogleEnd">

        <input id="transcription_input" ref="transcription_input" class="form-control" placeholder="Enter transcript">
        <button id="add_transcript" class="btn btn-primary" @click="addTranscript">Add Transcript</button>
      </div>
      
      <button @click="generateTranscript" id="upload_button" class="btn btn-primary">Transcribe Video</button>
    </div>

    <div v-show="show_waiting">
      <h1>Please Wait While We Process Your File.</h1>
    </div>

    <div v-show="show_generated">
        <video id="generated_video" ref="generated_video" controls>
          <source type="video/mp4" ref="generated_video_source">   
          <track kind="captions" srclang="en-us" label="English" ref="generated_transcript" default>
      </video>
        <a @click="downloadTranscript"><button id="download_link_button" class="btn btn-primary">Download Generated Transcript</button></a>
    </div>

  </div>
</template>


<script>
import axios from 'axios';
  import { saveAs } from 'file-saver';

export default {
    name: "IndexPage",
    props: ['title_from_user'],  	
    data() {
      return {
        prev_upload_vid: null,
        show_initial_frame: true,
        show_preview: false,
        show_table: false,
        show_waiting: false,
        show_generated: false,

        end_enabled: true,
        file: null,
        file_name: "Choose file...",
        transcription: [],
        user_ip: null,
      };
    },

    mounted() {
      // adding bootstrap CSS and JS

      // track the current playback time of both preview videos
      this.video_start = this.$refs.video_start;
      this.video_end = this.$refs.video_end;
      
      this.video_start.addEventListener("timeupdate", () => {
        document.getElementById("time_start_input").value = this.timeToStr(this.video_start.currentTime);
      });
      this.video_end.addEventListener("timeupdate", () => {
        document.getElementById("time_end_input").value = this.timeToStr(this.video_end.currentTime);
      });
      document.getElementById("time_end_input").value = null;
      axios.get('https://api.ipify.org?format=json')
        .then(response => {
          this.user_ip = response.data.ip;
        })
        .catch(error => {
          console.error(error);
        });
      
      if(this.$route.params.title_from_user != null){
        this.generatePreviouslyUploaded();
      }
    },
    methods: {

    // called when file is uploaded to input. checks if file format is correct and then shows for preview, else raises error.
    handleFileUpload(event) {
      this.file = event.target.files[0];
      if (!this.file.type.match('video/*')) {
        alert('Please provide only video file format.');
        this.file = null;
      } 
      else 
      {
        this.uploadVideo();
        this.previewVideo();
      }
    },
    
    // get the video and display it on .video-preview for preview
    previewVideo() {
      const video_start = document.getElementById('video_preview_start');
      const video_end = document.getElementById('video_preview_end');

      this.file_name = this.file.name;
      this.displayPreview();

      video_start.src = URL.createObjectURL(this.file);
      video_end.src = URL.createObjectURL(this.file);
      video_start.load();
      video_end.load();
    },

    // send video to flask API
    uploadVideo() {
        const formData = new FormData();
        formData.append('user_ip', this.user_ip);
        formData.append('video', this.file);
        const apiUrl = 'http://127.0.0.1:5000/api/add_video';

        axios.post(apiUrl, formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        })
          .then(async response => {
            this.TitleForAPI = await response.data.video_title;
          })
          .catch((error) => {
            console.error(error.message);
            alert('There was an unexpected error, please try again!');
          });
    },

    // adding transcript to the transcription dictionary
    addTranscript() {
      var end_time = this.$refs.time_end.value;
      var start_time = this.$refs.time_start.value;
      var text = this.$refs.transcription_input.value;
      if (start_time == "" || text == ""){
        alert("Start time and transcripts cannot be empty!")
      }
      else{
        if(end_time == ""){
          this.AddTranscriptToAPI(this.video_start.currentTime, -1, text);
        }
        else{
          if(end_time <= start_time){
            alert("End time must be more than the start time!");
          }
          else{
            this.AddTranscriptToAPI(this.video_start.currentTime, this.video_end.currentTime, text);
          }
        }
      }
    },
    
    // toggles the end input between inactive or active
    ToogleEnd(){
      this.end_enabled = this.$refs.end_active_input.checked;
      if (!this.end_enabled){
        document.getElementById("time_end_input").value = null;
      }
      else{
        document.getElementById("time_end_input").value = this.timeToStr(this.video_end.currentTime);
      }
    },

    timeInputEnd(event){
      if (this.isValidTimeFormat(event.target.value)){
        this.video_end.currentTime = this.strToTime(event.target.value);
      }
      else{
        event.target.value = this.timeToStr(this.video_end.currentTime);
      }
    },

    timeInputStart(event){
      if (this.isValidTimeFormat(event.target.value)){
        this.video_start.currentTime = this.strToTime(event.target.value);
      }
      else{
        event.target.value = this.timeToStr(this.video_end.currentTime);
      }
    },

    isValidTimeFormat(input) {
        // Regular expression pattern to match the format
        const pattern = /^(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d{1,2})$/;
        if (!pattern.test(input)) {
          return false;
        }

        const [, hours, minutes, seconds, milliseconds] = input.match(pattern);

        if (
          parseInt(hours, 10) >= 0 && parseInt(hours, 10) <= 23 &&
          parseInt(minutes, 10) >= 0 && parseInt(minutes, 10) <= 59 &&
          parseInt(seconds, 10) >= 0 && parseInt(seconds, 10) <= 59 &&
          parseInt(milliseconds, 10) >= 0 && parseInt(milliseconds, 10) <= 999
        ) {
          return true;
        }
    },

    timeToStr(timeInFloat) {
      // Check if the time is valid
      if (isNaN(timeInFloat)) {
        return "Invalid time";
      }
      // Get the hours, minutes, seconds, and milliseconds from the time
      const hours = Math.floor(timeInFloat / 3600);
      const minutes = Math.floor((timeInFloat / 60)) - (hours*60);
      const seconds = Math.floor(timeInFloat) - (hours*3600 + minutes*60);
      const milliseconds = Math.floor(timeInFloat * 100) - (hours*360000 + minutes*6000+ seconds*100);

      var timeStr = `${this.toTwoDigitString(hours)}:${this.toTwoDigitString(minutes)}:${this.toTwoDigitString(seconds)}.${this.toTwoDigitString(milliseconds)}`;

      // Return the time string
      return timeStr;
    },
    

    strToTime(string) {
        const pattern = /^(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d{1,2})$/;
        const [, hours, minutes, seconds, milliseconds] = string.match(pattern);
        var time = parseFloat(hours)*3600 + parseFloat(minutes)*60 + parseFloat(seconds) + parseFloat(milliseconds)/100;

        return time;
    },

    toTwoDigitString(number) {
      return number.toString().padStart(2, '0');
    },
    
    AddTranscriptToAPI(start_t, end_t, text){
      var transcript_id;
      const apiUrl = 'http://127.0.0.1:5000/api/add_transcript';
      var data = { 
        video_title: this.TitleForAPI,
        start_time: start_t, 
        end_time: end_t, 
        text: text
      }
      fetch(apiUrl, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then(async response => {
          if (!response.ok) {
            alert('There was an unexpected error, please try again!');
          }
          else{
            transcript_id = await response.json();
            if (end_t  == -1){
              this.transcription.push([transcript_id['transcript_id'], start_t, "-", text]);
            }
            else{
              this.transcription.push([transcript_id['transcript_id'], this.timeToStr(start_t), this.timeToStr(end_t), text]);
            }
            this.$refs.transcription_input.value = null;
            this.show_table = true;
          }
        })
        .catch((error) => {
          console.error(error.message);
          alert('There was an unexpected error, please try again!');
        });
    },
    generateTranscript(){
      if (this.show_table){
        this.displayWaiting();
        const apiUrl = 'http://127.0.0.1:5000/api/generate_transcript';
        axios({
          url: apiUrl,
          method: 'POST',
          responseType: 'blob',
          data:{
          headers: { "Content-Type": "application/json" },
          video_title: this.TitleForAPI,}
        })
          .then(async response => {
              this.generated_file = await response.data;
              this.displayGenerated();
          })
          .catch((error) => {
              if (error.message == 'Request failed with status code 404')
              {
                alert("Transcripts are overlapping!");
                this.displayPreview();
              }
              else{
                console.error(error.message);
                alert('There was an unexpected error, please try again!');
              }
          });
      }
      else{
        alert("Provide transcripts to generate video!");
      }
    },
    downloadTranscript(){
      const parts = this.TitleForAPI.split(".");
      const newFilename = parts.slice(0, parts.length - 1).join(".") + ".vtt";
      var vvt_extension_filename = newFilename
      
      saveAs(this.href, vvt_extension_filename);
    },
    editTranscript($event){
      var transcript_id = $event.target.id;
      const apiUrl = "http://127.0.0.1:5000/api/delete_transcript";
      axios({
        url: apiUrl,
        method: 'POST',
        data:{
        headers: { "Content-Type": "application/json" },
        'transcript_id': transcript_id,}
      })
        .then(response => {
          response;
          for(var x = 0; x<this.transcription.length; x++){
            if (this.transcription[x][0] == transcript_id){
              document.getElementById("time_start_input").value = this.transcription[x][1];
              document.getElementById("time_end_input").value = this.transcription[x][2];
              document.getElementById("transcription_input").value = this.transcription[x][3];
              this.transcription.splice(x, 1);
            }
          }
          if (this.transcription.length == 0){
            this.show_table=false;
          }
        })
        .catch((error) => {
            if (error.message == 'Request failed with status code 404')
            {
              alert("Transcript not found!");
            }
            else{
              console.error(error.message);
              alert('There was an unexpected error, please try again!');
            }
        });
    },

    deleteTranscript($event){
      var transcript_id = $event.target.id;
      const apiUrl = "http://127.0.0.1:5000/api/delete_transcript";
      axios({
        url: apiUrl,
        method: 'POST',
        data:{
        headers: { "Content-Type": "application/json" },
        'transcript_id': transcript_id,}
      })
        .then(response => {
          response;
          for(var x = 0; x<this.transcription.length; x++){
            if (this.transcription[x][0] == transcript_id){
              this.transcription.splice(x, 1);
            }
          }
          if (this.transcription.length == 0){
            this.show_table=false;
          }
        })
        .catch((error) => {
            if (error.message == 'Request failed with status code 404')
            {
              alert("Transcript not found!");
            }
            else{
              console.error(error.message);
              alert('There was an unexpected error, please try again!');
            }
        });  
    },
    
    generatePreviouslyUploaded(){
      var video_title = this.$route.params.title_from_user;
      const apiUrl = 'http://127.0.0.1:5000/api/get_video';
      axios({
        url: apiUrl,
        method: 'POST',
        responseType: 'blob',
        data:{
        headers: { "Content-Type": "application/json" },
        video_title: video_title}
      })
        .then(async response => {
          var resp = await response.data;
          this.file = resp;
          this.file_name = video_title;
          this.TitleForAPI = video_title;
          this.setupPreviouslyUploaded();
        })
        .catch((error) => {
          console.error(error.message);
          alert('There was an unexpected error, please try again!');
        });
    },
    setupPreviouslyUploaded(){
      const video_start = document.getElementById('video_preview_start');
      const video_end = document.getElementById('video_preview_end');
      
      this.displayPreview();

      video_start.src = URL.createObjectURL(this.file);
      video_end.src = URL.createObjectURL(this.file);
      video_start.load();
      video_end.load();
    },
    
    displayPreview(){
      this.show_initial_frame= false;
      this.show_preview= true;
      this.show_table= false;
      this.show_waiting= false;
      this.show_generated= false;
    },

    displayGenerated(){
      // show generated
      this.show_initial_frame= false;
      this.show_preview= false;
      this.show_table= false;
      this.show_waiting= false;
      this.show_generated= true;

      // display video
      this.$refs.generated_video_source.src = URL.createObjectURL(this.file);
      this.$refs.generated_video.load();

      // display subtitles
      this.href = URL.createObjectURL(this.generated_file);
      this.$refs.generated_transcript.src=this.href;
    },

    displayWaiting(){
        this.show_initial_frame = false;
        this.show_preview = false;
        this.show_table = false;
        this.show_waiting = true;
        this.show_generated = false;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
hr{
  width: 80%;
  border-color: black;
  margin-left: auto;
  margin-right: auto;
}

p{
  margin-bottom: 0;
}



.custom-file-label{
  margin-top: 0.5rem;
}

.custom-file{
  width: 50%;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

#video_preview_start, #video_preview_end{
  width: 37.5%;
  display: inline-block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 0.5rem;
}

#generated_video{
  width: 37.5%;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

#start_preview_title, #end_preview_title{
  width: 37.5%;
  display: inline-block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1rem;
  margin-bottom: 0;
  text-align: center;
}

#end_preview_title{
  margin-left: 5%;
}

#video_preview_end{
  margin-left: 5%;
}

.custom-file{
  margin-bottom: 0.5rem;
}

#upload_button{
  margin-top: 0.5rem;
  margin-bottom: 2rem;
}

.transcript-form{
  width: 50%;
  margin-left: auto;
  margin-right: auto;
}

#add_transcript{
  margin-top: 0.5rem;
}

.form-control{
  margin-top: 0.5rem;
}

#time_start_input{
  display: inline-block;
}

#time_end_input:focus, #time_start_input:focus{
  outline: none !important;
  box-shadow: none;
  border: 1px solid #ced4da;
}

.table{
  width: 80%;
  margin:auto;
  text-align: center;
  align-items: center;
}

.column{
  width: 25%;
}

.icon_column{
  width: 7.5%;
}

.delete_icon{
  width: 50%;
  height: 50%;
} 
.edit_icon{
  width: 40%;
}

td{
  vertical-align: baseline;
}

.time_end_input:focus{
  background-color: #e9ecef;
}

.checkbox-input{
  display: inline-flex;
  width: 8%;
  height: 1rem;
  margin-left: 1%;
  margin-right: 1%;
}

#time_end_input{
  display: inline-flex;
  width: 90%;
  margin-top: 0.5rem;
}

#download_link_button{
  margin-top: 0.5rem;
}
</style>
