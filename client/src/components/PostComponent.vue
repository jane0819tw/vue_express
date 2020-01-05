<template lang="pug">
div
  .hello 
    h1 {{msg}}
  label(for="new-post") new post
  input(v-model="text" type="text" placeholder="input new post text...")
  button(@click="insertPost()") post it
  ul
    li(v-for="(post,index) in posts" :key="post.createdAt.toString()" :style="{'animation-delay':index/3+'s'}")
      p.date {{post.createdAt}}
      p.text {{post.text}}
      button(@click="deletePost(post._id)") delete
      button(@click="updatePost(post._id)") update
  p.error(v-if="error") {{error}}
</template>

<script>
import PostService from "../PostService.js";

export default {
  name: "PostComponent",
  props: {
    msg: String
  },
  data() {
    return {
      posts: [],
      error: "",
      text: ""
    };
  },
  async created() {
    try {
      this.posts = await PostService.getPosts();
    } catch (err) {
      this.error = err;
    }
  },
  methods: {
    async insertPost() {
      try {
        await PostService.insertPost(this.text);
      } catch (err) {
        this.error = err;
      }
      this.posts = await PostService.getPosts();
    },
    async deletePost(id) {
      try {
        await PostService.deletePost(id);
      } catch (err) {
        this.error = err;
      }
      this.posts = await PostService.getPosts();
    },
    async updatePost(id) {
      try {
        await PostService.updatePost(id, this.text);
      } catch (err) {
        this.error = err;
      }
      this.posts = await PostService.getPosts();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
@keyframes fadeIn
  0%
    opacity: 0
  100%
    opacity: 1
h3 
  margin: 40px 0 0
p.error
  color: #f24
ul 
  list-style-type: none
  padding: 0
  li
    display: inline-block
    margin: 0 10px
    background-color: #41B883
    border-radius: 10px
    margin: 5px
    padding: 5px
    animation: fadeIn 2s both
    p.text
      color: #222
    p.date
      color: #ddd
</style>
