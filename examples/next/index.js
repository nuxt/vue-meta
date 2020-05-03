import { markRaw, reactive, onMounted } from 'vue'
import { defaultMapping } from './config'

const apps = {}
let appId = 1

export function createMeta ({ config }) {
  const id = Symbol(`vue-meta-${appId++}`)

  const Meta = {
    id,

    install (app) {
      let watchersAdded = false

      app.provide('__vueMetaConfig', {
        ...defaultMapping,
        ...config
      })

      app.mixin({
        created () {
          if (this === this.$root) {
            watchersAdded = true
          }

          if (!this.metaData || watchersAdded) {
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

          this.__meta = markRaw({
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

export function useMeta (rawMetainfo) {
  onMounted(vmMounted)

  const metainfo = reactive(rawMetainfo)

  return metainfo
}

function vmMounted () {
  console.log('MOUNTED', this, arguments)
}
