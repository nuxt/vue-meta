import { defineComponent } from 'vue'

export default defineComponent({
  data () {
    return {
      title: 'Data Title'
    }
  },
  metaInfo () {
    const title = this.title
    return {
      title: title + ' from Options API'
    }
  },
  template: '<div>This component uses the Options API</div>'
})
