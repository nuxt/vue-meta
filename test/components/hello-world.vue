<template>
  <div>Test</div>
</template>

<script>
export default {
  metaInfo() {
    return {
      title: this.title,
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' }
      ]
    }
  },
  data() {
    return {
      title: 'Hello World',
    }
  }
}
</script>
