import Vue from 'vue'
import Router from 'vue-router'
import VueMeta from '../../'

Vue.use(Router)
Vue.use(VueMeta, {
  tagIDKeyName: 'hid'
})

export default function createApp () {
  const Home = {
    template: `<div>
      <router-link to="/about">About</router-link>

      <p>Hello World</p>
    </div>`,
    metaInfo: {
      title: 'Hello World',
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: 'Hello World'
        },
        {
          hid: 'description',
          name: 'description',
          content: 'Hello World'
        }
      ]
    }
  }

  const About = {
    template: `<div>
      <router-link to="/">Home</router-link>

      <p>About</p>
    </div>`,
    metaInfo: {
      title: 'About World',
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: 'About World'
        },
        {
          hid: 'description',
          name: 'description',
          content: 'About World'
        }
      ]
    }
  }

  const router = new Router({
    mode: 'history',
    base: '/ssr',
    routes: [
      { path: '/', component: Home },
      { path: '/about', component: About }
    ]
  })

  const app = new Vue({
    router,
    metaInfo () {
      return {
        title: 'Boring Title',
        htmlAttrs: { amp: true },
        bodyAttrs: { class: 'main-app' },
        meta: [
          {
            skip: this.count < 1,
            hid: 'og:title',
            name: 'og:title',
            template: chunk => `${chunk} - My Site`,
            content: 'Default Title'
          },
          {
            hid: 'description',
            name: 'description',
            content: 'Say something'
          }
        ],
        script: [
          {
            hid: 'ldjson-schema',
            type: 'application/ld+json',
            innerHTML: '{ "@context": "http://www.schema.org", "@type": "Organization" }'
          }, {
            type: 'application/ld+json',
            innerHTML: '{ "body": "yes" }',
            body: true
          }, {
            hid: 'my-async-script-with-load-callback',
            src: '/user-1.js',
            body: true,
            defer: true,
            callback: this.loadCallback
          }, {
            skip: this.count < 1,
            src: '/user-2.js',
            body: true,
            callback: this.loadCallback
          }
        ],
        __dangerouslyDisableSanitizersByTagID: {
          'ldjson-schema': ['innerHTML']
        }
      }
    },
    data () {
      return {
        count: 0,
        users: process.server ? [] : window.users
      }
    },
    mounted() {
      const { set, remove } = this.$meta().addApp('client-only')
      set({
        bodyAttrs: { class: 'client-only' }
      })

      setTimeout(() => remove(), 3000)
    },
    methods: {
      loadCallback () {
        this.count++
      }
    },
    template: `
    <div id="app">
      <p>{{ count }} users loaded</p>

      <ul>
        <li
          v-for="user in users"
          :key="user.id"
        >
        {{ user.id }}: {{ user.name }}
        </li>
      </ul>

      <router-view />
    </div>`
  })

  const { set } = app.$meta().addApp('custom')
  set({
    bodyAttrs: { class: 'custom-app' },
    meta: [{ charset: 'utf-8' }]
  })

  return { app, router }
}
