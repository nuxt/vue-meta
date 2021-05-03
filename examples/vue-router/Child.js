import { defineComponent, ref, reactive, computed, toRefs, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMeta } from 'vue-meta'

let metaUpdated = 'no'

export default defineComponent({
  name: 'ChildComponent',
  setup () {
    const route = useRoute()

    const state = reactive({
      date: null,
      metaUpdated
    })

    const ogTitle = ref('Og Child Title')

    const metaConfig = computed(() => ({
      charset: 'utf16',
      title: route.name[0].toUpperCase() + route.name.slice(1),
      description: 'Description ' + route.name,
      og: {
        title: ogTitle.value + ' ' + route.name
      }
    }))

    const { onRemoved } = useMeta(metaConfig)

    const pageName = computed(() => route.name)

    onUnmounted(() => (metaUpdated = 'yes'))

    setTimeout(() => (ogTitle.value = 'Updated Child Og Title'), 1000)
    setTimeout(() => (delete metaConfig.value.og), 3000)

    onRemoved(() => {
      console.log('Meta was removed', pageName.value)
    })

    return {
      ...toRefs(state),
      pageName
    }
  },
  template: `<div>
    <h3>You're looking at the <strong>{{ pageName }}</strong> page</h3>
    <p>Has metaInfo been updated due to navigation? {{ metaUpdated }}</p>
  </div>`
})
