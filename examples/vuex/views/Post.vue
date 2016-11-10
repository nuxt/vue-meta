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
    name: 'post',
    beforeMount () {
      const { slug } = this.$route.params
      this.$store.dispatch('getPost', { slug })
    },
    computed: mapGetters([
      'post'
    ]),
    metaInfo () {
      return {
        title: this.post.title,
        meta: [
          { vmid: 'description', name: 'description', content: this.post.title }
        ]
      }
    }
  }
</script>
