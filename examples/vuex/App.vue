<template>
  <div id="app">
    <h1>vuex</h1>
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
    }
  }
</script>
