import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Home = () => import('./views/home.vue')
const Post = () => import('./views/about.vue')

export default function createRouter() {
  return new Router({
    mode: 'hash',
    base: '/',
    routes: [
      { path: '/', component: Home },
      { path: '/about', component: Post }
    ]
  })
}
