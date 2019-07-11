import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/home.vue'

Vue.use(Router)

const Post = () => import('./views/about.vue')

export default function createRouter () {
  return new Router({
    mode: 'hash',
    base: '/',
    routes: [
      { path: '/', component: Home },
      { path: '/about', component: Post }
    ]
  })
}
