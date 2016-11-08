import Vue from 'vue'
import VueMeta from 'vue-meta'
import Vuex from 'vuex'
import Router from 'vue-router'

Vue.use(Vuex)
Vue.use(Router)
Vue.use(VueMeta)

const store = new Vuex.Store({
  state: {
    posts: [{
      slug: 'a-sample-blog-post',
      title: 'A Sample Blog Post',
      content: 'This is the blog post content',
      published: true
    }, {
      slug: 'an-unpublished-blog-post',
      title: 'An Unpublished Blog Post',
      content: 'This is the blog post content',
      published: false
    }, {
      slug: 'another-blog-post',
      title: 'Another Blog Post',
      content: 'This is the blog post content',
      published: true
    }]
  },
  getters: {
    publishedPosts (state) {
      return state.posts.filter((post) => post.published)
    },
    publishedPostsCount (state, getters) {
      return getters.publishedPosts.length
    }
  }
})

const Home = {
  name: 'home',
  template: `
    <div>
      <h3>This is the homepage</h3>
      <h4>There are <u>{{ postsCount }}</u> published posts</h4>
      <ul>
        <li v-for="post in posts">
          <router-link :to="'posts/' + post.slug">{{ post.title }}</router-link>
        </li>
      </ul>
    </div>
  `,
  computed: {
    posts () {
      return this.$store.getters.publishedPosts
    },
    postsCount () {
      return this.$store.getters.publishedPostsCount
    }
  },
  metaInfo: {
    title: 'Home'
  }
}

const BlogPost = {
  name: `blog-post`,
  template: `
    <div>
      <h3>{{ post.title }}</h3>
      <p>{{ post.content}}<p>
      <router-link to="/">Go back home</router-link>
    </div>
  `,
  computed: {
    post () {
      return this.$store.getters.publishedPosts
        .find((post) => post.slug === this.$route.params.slug)
    }
  },
  metaInfo: {
    title () {
      return this.post.title
    }
  }
}

const router = new Router({
  mode: 'history',
  base: '/vuex',
  routes: [
    { path: '/', component: Home },
    { path: '/posts/:slug', component: BlogPost }
  ]
})

const App = {
  template: `
    <div id="app">
      <h1>vuex</h1>
      <router-view></router-view>
      <p>Inspect Element to see the meta info</p>
    </div>
  `
}

const app = new Vue(Object.assign(App, { router, store }))

app.$mount('#app')
