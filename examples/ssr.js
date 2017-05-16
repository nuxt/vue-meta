const Vue = require('vue')
const renderer = require('vue-server-renderer').createRenderer()
const VueMeta = require('../')

Vue.use(VueMeta, {
  tagIDKeyName: 'hid'
})

const vm = new Vue({
  template: '<hello/>',
  metaInfo: {
    title: 'Hello',
    htmlAttrs: { amp: undefined },
    meta: [
      { hid: 'description', name: 'description', content: 'Hello World' }
    ],
    script: [
      { innerHTML: '{ "@context": "http://www.schema.org", "@type": "Organization" }', type: 'application/ld+json' }
    ],
    __dangerouslyDisableSanitizers: ['script']
  },
  components: {
    Hello: {
      template: '<p>Hello</p>',
      metaInfo: {
        title: 'Coucou',
        meta: [
          { hid: 'description', name: 'description', content: 'Coucou' }
        ]
      }
    }
  }
})

const html = renderer.renderToString(vm, function (err, html) {
  console.log('Title', vm.$meta().inject().title.text())
  console.log('HTML', vm.$meta().inject().htmlAttrs.text())
  console.log('Meta', vm.$meta().inject().meta.text())
  console.log('Script', vm.$meta().inject().script.text())
})
