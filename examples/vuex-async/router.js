import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
import Home from './views/Home.vue'
import Post from './views/Post.vue'

Vue.use(Router)
Vue.use(Meta)

export default new Router({
  mode: 'history',
  base: '/vuex-async',
  routes: [
    { path: '/', component: Home },
    { path: '/posts/:slug', component: Post }
  ]
})
