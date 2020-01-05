<template lang="pug">
#app
  div
    router-link(to="/") show posts
    router-link(to="/game") play Math
    br
    // 當路徑改變，重新產生這個元件，動畫也重新產生
    transition(name="page" mode="out-in")
      router-view(:key="$route.path")
    
  
  // PostComponent(msg="Welcome to Your Vue.js App")
  
</template>

<script>
import PostComponent from "./components/PostComponent.vue";

export default {
  name: "app",
  components: {
    PostComponent
  }
};
</script>

<style lang="sass">
router-link
  margin: 10px
#app 
  font-family: "Avenir", Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  margin-top: 60px

.page-enter-active,.page-leave-active
  transition: 0.5s
.page-enter,.page-leave-to
  opacity: 0
</style>
