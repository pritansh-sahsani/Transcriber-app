<template>
  <div id="home_page">
    <!-- Bootstrap CSS and JS -->
		
    <h1 class="">Transcriber</h1><hr>
    <p class="">upload a video file to transcribe</p>
    
    <div class="custom-file">
      <input type="file" class="custom-file-input" id="validatedCustomFile" @change="handleFileUpload" required>
      <label class="custom-file-label" for="validatedCustomFile">{{ file_name }}</label>
      <div class="invalid-feedback">Example invalid custom file feedback</div>
    </div>

    <video id="video-preview" controls v-bind:style="show_preview"></video><br>
    <button @click="uploadVideo" class="btn btn-primary mt-3">Upload Video</button><br>
  </div>
</template>


<script>

export default {
    name: "IndexPage",
    data() {
      return {
        show_preview: "display: none;",
        file: null,
        file_name: "Choose file...",
      };
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
        this.show_preview = "display: block;",
        this.file_name = this.file.name
        this.previewVideo();
      }
    },
    
    // get the video and display it on .video-preview for preview
    previewVideo() {
      const video = document.getElementById('video-preview');
      video.src = URL.createObjectURL(this.file);
      video.load();
    },

    uploadVideo() {
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
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
hr{
  width: 80%;
  border-color: black;
}
.custom-file{
  width: 50%;
}

.video-preview
{
  width: 50%;
}

</style>
