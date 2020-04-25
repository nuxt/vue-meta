import { createApp, defineComponent, reactive, toRefs, h, onMounted } from 'vue'
import VueMeta from 'vue-meta'
import { createRouter, createWebHistory } from 'vue-router'
import About from './about.vue'
import { createMeta, useMeta } from '../next'

/*Vue.use(VueMeta, {
  refreshOnceOnNavigation: true
})*/

const meta = createMeta({

})

let metaUpdated = 'no'
const ChildComponent = defineComponent({
  name: 'child-component',
  props: {
    page: String
  },
  template: `
<metainfo>
  <title>Another Title</title>
</metainfo>
<div>
  <h3>You're looking at the <strong>{{ page }}</strong> page</h3>
  <p>Has metaInfo been updated due to navigation? {{ metaUpdated }}</p>
</div>`,
  metaInfo () {
    return {
      title: `${this.page} - ${this.date && this.date.toTimeString()}`,
      bodyAttrs: {
        class: 'child-component'
      },
      afterNavigation () {
        metaUpdated = 'yes'
      }
    }
  },
  created () {
    console.log(this)
  },
  setup () {
    const metaData = useMeta({
    })

    const state = reactive({
      date: null,
      metaUpdated
    })


    onMounted(function vmMounted() {
      console.log('MOUNTED', this, arguments)
    })


    return {
      metaData,
      ...toRefs(state)
    }
  },
  /*mounted () {
    this.interval = setInterval(() => {
      this.date = new Date()
    }, 1000)
  },
  destroyed () {
    clearInterval(this.interval)
  }*/
})

// this wrapper function is not a requirement for vue-router,
// just a demonstration that render-function style components also work.
// See https://github.com/nuxt/vue-meta/issues/9 for more info.
function view (page) {
  return {
    name: `section-${page}`,
    render () {
      return h(ChildComponent, { page })
    }
  }
}

const router = createRouter({
  history: createWebHistory('/vue-router'),
  routes: [
    { name: 'home', path: '/', component: view('home') },
    { name: 'about', path: '/about', component: About }
  ]
})

const Metadata = {
  template: `
    <teleport to="head">
      <slot />
    </teleport>

    <teleport to="body">
      <slot name="body" />
    </teleport>
  `
}

const App = {
  template: `
    <metainfo>
      <title>My Title</title>
      <meta name="charset" content="utf8" />

      <template v-slot:body>
        <script>var a = 1</script>
      </template>
    </metainfo>

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

const app = createApp(App)
app.component('metainfo', Metadata)
app.use(router)
app.use(meta)
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
app.mount('#app')

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
