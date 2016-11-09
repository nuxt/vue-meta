<template>
  <div>
    <template v-if="isLoading">
      <h3>Loading...</h3>
    </template>
    <template v-else>
      <h3>{{ post.title }}</h3>
      <p>{{ post.content}}<p>
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
      // since fetching a post is asynchronous,
      // we need to call `this.$meta().refresh()`
      // to update the meta info
      this.$store.dispatch('getPost', { slug })
        .then(() => this.$meta().refresh())
    },
    computed: mapGetters([
      'isLoading',
      'post'
    ]),
    metaInfo: {
      title () {
        return this.isLoading ? 'Loading...' : this.post.title
      }
    }
  }
</script>
