import { defineComponent, ref, reactive, computed, toRefs, onUnmounted } from 'vue'
import { isSymbol } from '@vue/shared'
import { useRoute } from 'vue-router'
import { useMeta } from '../../src'

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

    let routeName: string
    if (isSymbol(route.name)) {
      routeName = route.name.toString()
    } else if (route.name) {
      routeName = route.name
    }

    const metaConfig = computed(() => ({
      charset: 'utf16',
      title: routeName[0].toUpperCase() + routeName.slice(1),
      description: 'Description ' + routeName,
      og: {
        title: ogTitle.value + ' ' + routeName
      },
      htmlAttrs: routeName !== 'home'
        ? {}
        : {
            lang: ['nl']
          }
    }))

    const { onRemoved } = useMeta(metaConfig)

    const pageName = computed(() => routeName)

    onUnmounted(() => (metaUpdated = 'yes'))

    setTimeout(() => (ogTitle.value = 'Updated Child Og Title'), 1000)
    setTimeout(() => (delete (metaConfig.value as Partial<typeof metaConfig.value>).og), 3000)

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
