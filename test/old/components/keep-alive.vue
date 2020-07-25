<template>
  <div>
    <keep-alive>
      <hello-world v-if="childVisible"></hello-world>
    </keep-alive>
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
      title: 'Alive World'
    }
  }
}
</script>
