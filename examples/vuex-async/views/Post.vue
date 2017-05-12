<template>
  <div>
    <template v-if="isLoading">
      <h3>Loading...</h3>
    </template>
    <template v-else>
      <h3>{{ post.title }}</h3>
      <p>{{ post.content}}</p>
      <router-link to="/">Go back home</router-link>
    </template>
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
      'isLoading',
      'post'
    ]),
    metaInfo () {
      return {
        title: this.isLoading ? 'Loading...' : this.post.title,
        meta: [
          { vmid: 'description', name: 'description', content: this.post.title }
        ]
      }
    }
  }
</script>
