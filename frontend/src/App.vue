<template>
  <nav class="navbar navbar-expand-sm navbar-dark bg-primary px-3 mb-5">
    <router-link class="navbar-brand" to="/">Transcriptor</router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
      <ul class="navbar-nav mr-auto mt-2 mt-sm-0">
        <li class="nav-item active">
          <router-link to="/" class="nav-link mr-sm-3">Create Transcript</router-link>
        </li>
        <li class="nav-item active">
          <router-link to="/user" class="nav-link">My Videos and Transcripts</router-link>
        </li>
      </ul>
    </div>
  </nav>
  <router-view />
</template>

<script>
export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
