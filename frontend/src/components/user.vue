<template>
  <div v-show="show_initial_frame">
    <h1>Please Wait While We Get Your Files.</h1>
  </div>
  <div v-show="show_table">
    <!-- table for displaying current transcript -->
    <table class="table">
      <thead class="thead-light">
        <tr>
          <th scope="col" class="column">Video File Name</th>
          <th scope="col" class="column">Generated</th>
        </tr>
      </thead>
      <thead>
        <tr v-for="title in video_titles" ref="table" :key="title+'_div'" :class="title+'_div'">
          <td>
            <p>{{title}}</p>
          </td>
          <td v-show="titles[title] == null">
            <router-link :to="{name:'IndexPageWithUserTitle', params: { title_from_user: title }}"><button class="btn btn-outline-primary">Generate</button></router-link>
          </td>
          <td v-show="titles[title] != null">
            <button class="btn btn-outline-primary" :id="titles[title]" @click="downloadTranscript">Download</button>
          </td>
        </tr>
    </thead>
  </table>
</div>

</template>
<script>
  import axios from 'axios';
  import { saveAs } from 'file-saver';
  
export default {
  name: "UserPage",
    
    data() {
      return {
        show_initial_frame: true,
        show_table: false,

        user_ip: null,
        titles: null,
        video_titles: null,
      };
    },
  
    mounted() {
      this.get_user_ip();
    },
    methods: {
      get_user_ip(){
        axios.get('https://api.ipify.org?format=json')
        .then(response => {
          this.user_ip = response.data.ip;
          this.display_user_generations();
        })
        .catch(error => {
          console.error(error);
        });
      },

      display_user_generations(){
        const apiUrl = 'http://127.0.0.1:5000/api/get_titles';
        axios({
          url: apiUrl,
          method: 'POST',
          data:{
          headers: { "Content-Type": "application/json" },
          user_ip: this.user_ip,}
        })
          .then(async response => {
            var resp = await response.data;
            const dictionary = {};

            // Iterate through the proxy object and add each key-value pair to the new dictionary
            Object.entries(resp).forEach((keyValuePair) => {
              const [key, value] = keyValuePair;
              dictionary[key] = value;
            });

            // Freeze the new dictionary
            Object.freeze(dictionary);

            this.titles = dictionary;
            this.video_titles = Object.keys(dictionary);
            this.display_table();
          })
          .catch((error) => {
            console.error(error.message);
            alert('There was an unexpected error, please try again!');
          });
      },

      downloadTranscript($event){
        var transcription_title = $event.target.id;
        const apiUrl = 'http://127.0.0.1:5000/api/download_transcript';
        axios({
          url: apiUrl,
          method: 'POST',
          responseType: 'blob',
          data:{
          headers: { "Content-Type": "application/json" },
          transcript_title: transcription_title}
        })
          .then(async response => {
            var resp = await response.data;
            saveAs(resp, transcription_title);
          })
          .catch((error) => {
            console.error(error.message);
            alert('There was an unexpected error, please try again!');
          });
      },
      generatePreviouslyUploaded($event){
        var video_title = $event.target.id;
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
            resp;
          })
          .catch((error) => {
            console.error(error.message);
            alert('There was an unexpected error, please try again!');
          });
      },
      display_table(){
        this.show_initial_frame = false;
        this.show_table = true;
      },
    },
  };
  </script>
  
  <style scoped>
    .column{
      width: 40%;
    }
    td, button{
      vertical-align: baseline;
    }
    p{
      margin-bottom: 0;
    }
  </style>
  