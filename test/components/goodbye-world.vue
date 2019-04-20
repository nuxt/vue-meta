<template>
  <div>
    <hello-world v-if="childVisible"></hello-world>
  </div>
</template>

<script>
import HelloWorld from './hello-world.vue'

export default {
  components: {
    HelloWorld
  },
  metaInfo() {
    return {
      title: this.title,
    }
  },
  data() {
    return {
      childVisible: true,
      title: 'Goodbye World'
    }
  }
}
</script>
