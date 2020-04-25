import { markRaw, reactive, computed, onMounted } from 'vue'

const apps = {}

export function createMeta () {
  const id = Symbol()

  const Meta = {
    id,

    install(app) {
      let watchersAdded = false

      app.mixin({
        created() {
          if (this === this.$root) {
            
            watchersAdded = true
          }

          if (!this.metaData) {
            return
          }

          let depth = 0
          let parent = this
          while (parent) {
            parent = parent.$parent
            depth++

            if (parent === this.$root) {
              break
            }
          }

          const __meta = markRaw({
            depth
          })
          console.log('CREATED', this, this.metaData, depth)
        }
      })

      app.config.globalProperties.$meta = this
    }
  }

  apps[id] = Meta

  return Meta
}

export function useMeta () {
  onMounted(vmMounted)

  const metaData = reactive([])
  console.log(this)

  return metaData
}

function vmMounted() {
  console.log('MOUNTED', this, arguments)
}
