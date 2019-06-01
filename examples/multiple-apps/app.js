import Vue from 'vue'
import VueMeta from 'vue-meta'

Vue.use(VueMeta)

new Vue({
  metaInfo: () => ({
    title: 'App 1 title',
    bodyAttrs: {
      class: 'app-1'
    },
    meta: [
      { name: 'description', content: 'Hello from app 1', vmid: 'test' },
      { name: 'og:description', content: 'Hello from app 1' }
    ],
    script: [
      { innerHTML: 'var appId=1.1', body: true },
      { innerHTML: 'var appId=1.2', vmid: 'app-id-body' },
    ]
  }),
  template: `
    <div id="app1"><h1>App 1</h1></div>
  `
}).$mount('#app1')

new Vue({
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
      { innerHTML: 'var appId=2.2', vmid: 'app-id-body', body: true },
    ]
  }),
  template: `
    <div id="app2"><h1>App 2</h1></div>
  `
}).$mount('#app2')
