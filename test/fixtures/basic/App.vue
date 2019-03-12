<template>
  <div id="app">
    <h1>Basic</h1>
    <router-view></router-view>
    <p>Inspect Element to see the meta info</p>
  </div>
</template>

<script>
export default {
  metaInfo: {
    meta: [
      { vmid: 'charset', charset: 'utf-8' }
    ]
  },
  mounted() {
    this.$router.afterEach((to, from) => this.$emit('routeChanged', to, from))
    window.$vueMeta = this
  }
}
</script>
