import Vue from 'vue'
// import VueMeta from 'vue-meta'

export default async function createApp() {
  // the dynamic import is for this example only
  const vueMetaModule = process.env.NODE_ENV === 'development' ? '../../' : 'vue-meta'
  const VueMeta = await import(vueMetaModule).then(m => m.default || m)

  Vue.use(VueMeta, {
    tagIDKeyName: 'hid'
  })

  return new Vue({
    components: {
      Hello: {
        template: '<p>Hello</p>',
        metaInfo: {
          title: 'Coucou',
          meta: [
            {
              hid: 'description',
              name: 'description',
              content: 'Coucou'
            }
          ]
        }
      }
    },
    template: '<hello/>',
    metaInfo: {
      title: 'Hello',
      htmlAttrs: { amp: true },
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Hello World'
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
        }
      ],
      __dangerouslyDisableSanitizersByTagID: {
        'ldjson-schema': ['innerHTML']
      }
    }
  })
}
