<template>
  <html {{ head.headAttrs.text() }}>
    <head></head>
    bla
  </html>
</template>


<script>
export default {
  metaInfo() {
    return {
      title: this.title
    }
  },
  data() {
    return {
      title: 'Hello World',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' }
      ]
    }
  },
  computed: {
    head() {
      return meta.inject()
    }
  }
}
</script>
