import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'

Vue.use(Router)
Vue.use(Meta)

const Home = () => import('./views/Home.vue')
const Post = () => import('./views/Post.vue')

export default new Router({
  mode: 'history',
  base: '/vuex',
  routes: [
    { path: '/', component: Home },
    { path: '/posts/:slug', component: Post },
  ],
})
