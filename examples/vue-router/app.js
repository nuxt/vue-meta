import Vue from 'vue'
import VueMeta from 'vue-meta'
import Router from 'vue-router'

Vue.use(Router)
Vue.use(VueMeta)

const ChildComponent = () => ({
  name: `child-component`,
  props: ['page'],
  template: `<h3>You're looking at the <strong>{{ page }}</strong> page</h3>`,
  metaInfo: {
    title () {
      return this.page
    }
  }
})

function view (page) {
  return {
    name: `section-${page}`,
    render (h) {
      return h(ChildComponent(), {
        props: { page }
      })
    }
  }
}

const router = new Router({
  mode: 'history',
  base: '/vue-router',
  routes: [
    { path: '/', component: view('home') },
    { path: '/about', component: view('about') }
  ]
})

const App = {
  template: `
    <div id="app">
      <h1>vue-router</h1>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-view></router-view>
      <p>Inspect Element to see the meta info</p>
    </div>
  `
}

const app = new Vue(Object.assign(App, { router }))

app.$mount('#app')
