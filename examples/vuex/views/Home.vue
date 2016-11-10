<template>
  <div>
    <h3>This is the homepage</h3>
    <h4>There are <u>{{ postsCount }}</u> published posts</h4>
    <ul>
      <li v-for="post in posts">
        <router-link :to="'posts/' + post.slug">{{ post.title }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'home',
    computed: mapGetters({
      posts: 'publishedPosts',
      postsCount: 'publishedPostsCount'
    }),
    metaInfo: {
      title: 'Home',
      meta: [
        { vmid: 'description', name: 'description', content: 'The home page' }
      ]
    }
  }
</script>
