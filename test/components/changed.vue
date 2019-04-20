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
      changed: this._changed
    }
  },
  data() {
    return {
      childVisible: false,
      _changed: () => {}
    }
  },
  mounted() {
    this._changed = this.changed.bind(this)
  }
}
</script>
