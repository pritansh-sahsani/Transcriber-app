<template>
  <div id="home_page">		
    <h1>Transcriber</h1><hr>
    <p v-show="!show_preview">upload a video file to transcribe</p>
    
    <!-- input for video file -->
    <div class="custom-file">
      <input type="file" class="custom-file-input" id="validatedCustomFile" @change="handleFileUpload" required>
      <label class="custom-file-label" for="validatedCustomFile">{{ file_name }}</label>
      <div class="invalid-feedback">Example invalid custom file feedback</div>
    </div>

    <!-- video previews -->
    <div class="video_previews" v-show="show_preview">
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
          <th scope="col" class="column">Subtitle</th>
        </tr>
      </thead>
      <thead>
        <tr v-for="transcript in transcription" :key="transcript[0]">
          <td>
            {{transcript[0]}}
          </td>
          <td>
            {{transcript[1]}}
          </td>
          <td>
            {{transcript[2]}}
          </td>
        </tr>
      </thead>
    </table>

    <!-- form for getting transcript --> 
    <div class="transcript-form" v-show="show_preview">
      <input id="time_start_input" ref="time_start" class="form-control" @change="timeInputStart">
      <input id="time_end_input" ref="time_end" class="form-control" placeholder="End time is disabled." @change="timeInputEnd" :readonly="!end_enabled">

      <input id="end_active_input" ref="end_active_input" class="checkbox-input" type="checkbox" checked @click="ToogleEnd">

      <input id="transcription_input" ref="transcription_input" class="form-control" placeholder="Enter transcript">
      <button id="add_transcript" class="btn btn-primary" @click="addTranscript">Add Transcript</button>
    </div>
    
    <button @click="uploadVideo" id="upload_button" class="btn btn-primary" v-show="show_preview">Transcribe Video</button>
  </div>
</template>


<script>
export default {
    name: "IndexPage",
    
    data() {
      return {
        show_preview: false,
        show_table: false,
        end_enabled: true,
        file: null,
        file_name: "Choose file...",
        transcription: [],
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
        this.previewVideo();
      }
    },
    
    // get the video and display it on .video-preview for preview
    previewVideo() {
      const video_start = document.getElementById('video_preview_start');
      const video_end = document.getElementById('video_preview_end');

      this.file_name = this.file.name;
      this.show_preview = true;

      video_start.src = URL.createObjectURL(this.file);
      video_end.src = URL.createObjectURL(this.file);
      video_start.load();
      video_end.load();
    },

    // send video to flask API
    uploadVideo() {
      if(this.file == null)
      {
        alert('Please provide a video.');
      }
      else
      {
        const formData = new FormData();
        formData.append('video', this.file);
        const apiUrl = 'http://127.0.0.1:5000/api/test';

        fetch(apiUrl, {
          method: 'POST',
          body: formData,
        })
          .then((response) => {
            if (response.ok) {
              alert('Video uploaded successfully!');
            } else {
              alert('There was an unexpected error, please try again!');
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },

    // adding transcript to the transcription dictionary
    addTranscript() {
      var end_time = this.$refs.time_end.value;
      var start_time = this.$refs.time_start.value;
      var text = this.$refs.transcription_input.value;
      if (start_time == "" || text == ""){
        alert("Start time and subtitles cannot be empty!")
      }
      else{
        if(end_time == ""){
          this.transcription.push([start_time, "-", text]);
          this.$refs.transcription_input.value = "";
        }
        else{
          if(end_time <= start_time){
            alert("End time must be more than the start time!");
          }
          else{
            this.transcription.push([start_time, end_time, text]);
          }
        }
      }
      
      if(this.transcription.length>0){
        this.show_table = true
      }
    },
    
    // toggles the end input between inactive or active
    ToogleEnd(){
      this.end_enabled = this.$refs.end_active_input.checked;
      if (!this.end_enabled)
      {
        document.getElementById("time_end_input").value = null;
      }
      else
      {
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
  width: 30%;
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

</style>
