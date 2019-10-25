import Vue from 'vue'
import VueMeta from 'vue-meta'
import Router from 'vue-router'
import { createMixin } from './vue-meta-next/mixin'

Vue.use(Router)
/*Vue.use(VueMeta, {
  refreshOnceOnNavigation: false,
  //waitOnDestroyed: false,
  //debounceWait: 0
})
/**/

Vue.mixin(createMixin())
/**/

let metaUpdated = 'no'
const ChildComponent = {
  name: 'child-component',
  props: ['page'],
  template: `<div>
<h3>You're looking at the <strong>{{ page }}</strong> page</h3>
<p>Has metaInfo been updated due to navigation? {{ metaUpdated }}</p>
</div>`,
  metaInfo: {
    title() {
       return `${this.page} - ${this.date && this.date.toTimeString()}`
    },
    /*bodyAttrs: {
      class: 'child-component'
    },*/
    meta: [
      function () { return { vmid: 'descr', name: 'description', content: `description at ${this && this.date2 && this.date2.toTimeString()}` } },
      { name: 'og:description', content: `og:description at ${this && this.date2 && this.date2.toTimeString()}` }
    ],
    /*afterNavigation () {
      metaUpdated = 'yes'
    }*/
  },
  data () {
    return {
      date: null,
      date2: null,
      metaUpdated
    }
  },
  mounted () {
    this.interval = setInterval(() => {
      this.date = new Date()
    }, 1000)

    this.interval2 = setInterval(() => {
      this.date2 = new Date()
    }, 3000)
  },
  destroyed () {
    clearInterval(this.interval)
    clearInterval(this.interval2)
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

const getTime = () => window.performance.now()

let navtime
let navtimes = []

const App = {
  router,
  metaInfo() {
    return {
      meta: [
      { vmid: 'descr', name: 'description', content: 'JAHASJDKASD' }
      ]
    }
  },
  created() {
    router.beforeEach((to, from, next) => {
      navtime = getTime()
      console.log('before', navtime)
      next()
    })

    router.afterEach((to, from) => {
      console.log('after', getTime())
      navtimes.push((getTime()) - navtime)
      console.log(navtimes.length, navtimes.reduce((acc, v) => (acc + v), 0) / navtimes.length, document.title, '|', top.location.pathname)
    })
  },
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
//      <transition name="page" mode="out-in">

const app = new Vue(App)
/*
const { set, remove } = app.$meta().addApp('custom')

set({
  bodyAttrs: {
    class: 'custom-app'
  },
  meta: [
    { charset: 'utf=8' }
  ]
})
setTimeout(() => remove(), 3000)
*/
app.$mount('#app')
/*
let i = 0
const interval = setInterval(() => {
  router.push(top.location.href.includes('about') ? '/' : '/about')
  i++
  if (i == 3) {
    navtimes.shift()
    navtimes.shift()
  }
  if (i >= 50) {
    clearInterval(interval)
  }
}, 1000)
/**/

/*
const waitFor = time => new Promise(r => setTimeout(r, time || 1000))
const o = {
  meta: [{ a: 1 }]
}
const ob = Vue.observable(o)

const root = new Vue({
  beforeCreate() {
    this.meta = ob.meta

    this.$options.computed = this.$options.computed || {}
    this.$options.computed['$ob'] = () => {
      return { meta: this.meta }
    }
  },
  created() {
    console.log('HERE')
    this.$watch('$ob', (a, b) => {
      console.log('WATCHER', this.$ob.meta[0].a, a.meta[0].a, b.meta[0].a, diff(a, b))
    }, { deep: true })
  },
  render(h) {
    return h('div', null, 'test')
  }
})

async function main () {
  root.$mount('#app')
  console.log(root)
  await waitFor(500)

  root.meta[0].a = 2
  await waitFor(100)

  ob.meta[0].a = 3
  await waitFor(100)
}
main()
/**/
