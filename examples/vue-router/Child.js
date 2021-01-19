import { defineComponent, reactive, toRefs } from 'vue'
import { useMeta } from 'vue-meta'

const metaUpdated = 'no' // TODO: afterNavigation hook?

export default defineComponent({
  name: 'ChildComponent',
  props: {
    page: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const state = reactive({
      date: null,
      metaUpdated
    })

    const title = props.page[0].toUpperCase() + props.page.slice(1)
    console.log('ChildComponent Setup')

    useMeta({
      charset: 'utf16',
      title,
      description: 'Description ' + props.page,
      og: {
        title: 'Og Title ' + props.page
      }
    })

    return toRefs(state)
  },
  template: `
  <div>
    <h3>You're looking at the <strong>{{ page }}</strong> page</h3>
    <p>Has metaInfo been updated due to navigation? {{ metaUpdated }}</p>
  </div>
  `
})
