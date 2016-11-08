<template>
  <div>
    <h3>{{ post.title }}</h3>
    <p>{{ post.content}}<p>
    <router-link to="/">Go back home</router-link>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'blog-post',
    beforeMount () {
      const { slug } = this.$route.params
      this.$store.dispatch('getPost', { slug })
    },
    computed: mapGetters([
      'post'
    ]),
    metaInfo: {
      title () {
        return this.post.title
      }
    }
  }
</script>
