<template>
  <div>Test</div>
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
  }
}
</script>
