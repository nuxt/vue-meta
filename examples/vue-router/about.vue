<template>
  <h3>You're looking at the <strong>{{ page }}</strong> page</h3>
  <p>Has metaInfo been updated due to navigation? {{ metaUpdated }}</p>
</template>

<script>
/*
<head type="template">
  <title v-if="title">{{ title }}</title>
  <meta v-for="meta in metas" :name="meta.name" :content="meta.content" />
</head>
*/
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  props: {
    page: String
  },
  setup(props) {
    const metaUpdated = ref()
    const route = useRoute()

    onMounted(() => console.log(route))

    return { metaUpdated, page: route.name }
  }
}
</script>
