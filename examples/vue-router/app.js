import Vue from 'vue'
import VueMeta from 'vue-meta'
import Router from 'vue-router'

Vue.use(Router)
Vue.use(VueMeta, {
  refreshOnceOnNavigation: true
})

let metaUpdated = 'no'
const ChildComponent = {
  name: 'child-component',
  props: ['page'],
  template: `<div>
<h3>You're looking at the <strong>{{ page }}</strong> page</h3>
<p>Has metaInfo been updated? {{ metaUpdated }}</p>
</div>`,
  metaInfo () {
    return {
      title: `${this.page} - ${this.date && this.date.toTimeString()}`,
      afterNavigation () {
        metaUpdated = 'yes'
      }
    }
  },
  data () {
    return {
      date: null,
      metaUpdated
    }
  },
  mounted () {
    this.interval = setInterval(() => {
      this.date = new Date()
    }, 1000)
  },
  destroyed () {
    clearInterval(this.interval)
  }
}

// this wrapper function is not a requirement for vue-router,
// just a demonstration that render-function style components also work.
// See https://github.com/nuxt/vue-meta/issues/9 for more info.
function view (page) {
  return {
    name: `section-${page}`,
    render (h) {
      return h(ChildComponent, {
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
  router,
  template: `
    <div id="app">
      <h1>vue-router</h1>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <transition name="page" mode="out-in">
        <router-view></router-view>
      </transition>
      <p>Inspect Element to see the meta info</p>
    </div>
  `
}

const app = new Vue(App)

app.$mount('#app')
