<template>
<div>
  <h2>Home</h2>
  <router-link to="/about">Go to About</router-link>
</div>
</template>

<script>
export default {
  metaInfo() {
    return {
      title: 'Home',
      titleTemplate: '%s | Vue Meta Test',
      htmlAttrs: {
        lang: 'en',
        allowfullscreen: undefined,
        amp: true
      },
      headAttrs: {
        test: true
      },
      meta: [
        { name: 'description', content: 'Hello', vmid: 'test' }
      ],
      script: [
        { vmid: 'ldjson', innerHTML: '{ "@context": "http://www.schema.org", "@type": "Organization" }', type: 'application/ld+json' },
        { innerHTML: '{ "more": "data" }', type: 'application/ld+json' },
        { vmid: 'loadtest', src: '/load-test.js', body: true, async: true, callback: () => (window.loadCallback = 'yes') }
      ],
      noscript: [
        { innerHTML: '{ "pbody": "yes" }', pbody: true, type: 'application/ld+json' },
        { innerHTML: '{ "body": "yes" }', body: true, type: 'application/ld+json' }
      ],
      __dangerouslyDisableSanitizers: ['noscript'],
      __dangerouslyDisableSanitizersByTagID: { ldjson: ['innerHTML'] }
    }
  }
}
</script>
