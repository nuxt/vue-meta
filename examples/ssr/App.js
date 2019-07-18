import Vue from 'vue'
import VueMeta from '../../'

Vue.use(VueMeta, {
  tagIDKeyName: 'hid'
})

export default function createApp () {
  return new Vue({
    components: {
      Hello: {
        template: '<p>Hello World</p>',
        metaInfo: {
          title: 'Hello World',
          meta: [
            {
              hid: 'description',
              name: 'description',
              content: 'The description'
            }
          ]
        }
      }
    },
    metaInfo () {
      return {
        title: 'Boring Title',
        htmlAttrs: { amp: true },
        meta: [
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
            async: true,
            callback: () => this.loadCallback()
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
    methods: {
      loadCallback () {
        this.count++
      }
    },
    template: `
    <div id="app">
      <hello/>

      <p>{{ count }} users loaded</p>

      <ul>
        <li v-for="({id, name}) in users">
        {{ id }}: {{ name }}
        </li>
      </ul>
    </div>`
  })
}
