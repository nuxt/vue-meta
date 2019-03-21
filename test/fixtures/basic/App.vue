<template>
  <div id="app">
    <h1>Basic</h1>
    <router-view></router-view>
    <p>Inspect Element to see the meta info</p>
  </div>
</template>

<script>
export default {
  metaInfo() {
    return {
      meta: [
        { vmid: 'charset', charset: 'utf-8' }
      ],
      afterNavigation: () => {
        this.$emit('routeChanged')
      }
    }
  },
  mounted() {
    window.$vueMeta = this
  }
}
</script>
