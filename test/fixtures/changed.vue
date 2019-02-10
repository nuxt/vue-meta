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
      changed: this.changed
    }
  },
  data() {
    return {
      childVisible: false,
      changed: () => {}
    }
  }
}
</script>
