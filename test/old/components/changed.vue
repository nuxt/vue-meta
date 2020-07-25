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
  props: {
    changed: {
      type: Function
    }
  },
  metaInfo() {
    return {
      changed: this.changed.bind(this)
    }
  },
  data() {
    return {
      childVisible: false
    }
  }
}
</script>
