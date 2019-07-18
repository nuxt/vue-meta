import Vue from 'vue'
import VueMeta from 'vue-meta'

Vue.use(VueMeta)

// index.html contains a manual SSR render

const app1 = new Vue({
  metaInfo () {
    return {
      title: 'App 1 title',
      bodyAttrs: {
        class: 'app-1'
      },
      meta: [
        { name: 'description', content: 'Hello from app 1', vmid: 'test' },
        { name: 'og:description', content: this.ogContent }
      ],
      script: [
        { innerHTML: 'var appId=1.1', body: true },
        { innerHTML: 'var appId=1.2', vmid: 'app-id-body' }
      ]
    }
  },
  data () {
    return {
      ogContent: 'Hello from ssr app'
    }
  },
  template: `
    <div id="app1"><h1>App 1</h1></div>
  `
})

const app2 = new Vue({
  metaInfo: () => ({
    title: 'App 2 title',
    bodyAttrs: {
      class: 'app-2'
    },
    meta: [
      { name: 'description', content: 'Hello from app 2', vmid: 'test' },
      { name: 'og:description', content: 'Hello from app 2' }
    ],
    script: [
      { innerHTML: 'var appId=2.1', body: true },
      { innerHTML: 'var appId=2.2', vmid: 'app-id-body', body: true }
    ]
  }),
  template: `
    <div id="app2"><h1>App 2</h1></div>
  `
}).$mount('#app2')

app1.$mount('#app1')

const app3 = new Vue({
  template: `
    <div id="app3"><h1>App 3 (empty metaInfo)</h1></div>
  `
}).$mount('#app3')

setTimeout(() => {
  console.log('trigger app 1')
  app1.$data.ogContent = 'Hello from app 1'
}, 2500)

setTimeout(() => {
  console.log('trigger app 2')
  app2.$meta().refresh()
}, 5000)

setTimeout(() => {
  console.log('trigger app 3')
  app3.$meta().refresh()
}, 7500)

setTimeout(() => {
  console.log('trigger app 4')
  const App = Vue.extend({ template: `<div>app 4</div>` })
  new App().$mount()
}, 10000)
