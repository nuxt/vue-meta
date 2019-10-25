import {
  allMetaData,
  displayedMetaData,
  onComponentDestroyed,
  updateMetaInfo,
  updateMetaInfoForType
} from './meta'

import {
  getComponentDepth,
  createWatcher
} from './util'

let vueMetaComponentId = 1
let watchersAdded = false

export function createMixin() {
  return {
    created() {
      // add global meta watchers on root only once for the full page
      // TODO: maybe create our own vue-meta Vue instance for that?
      // -> new Vue instance takes a coupe of ms
      if (this === this.$root) {
        if (watchersAdded) {
          return
        }
        watchersAdded = true

        // for easily debugging
        this.$data.metaInfo = displayedMetaData
        this.$data.allMetaInfo = allMetaData

        for (const type in displayedMetaData) {
          if (type === 'title') {
            this.$watch(
              `$data.metaInfo.${type}`,
              createWatcher(type),
              { deep: true, immediate: true }
            )
            continue
          }

          for (const key in displayedMetaData[type]) {
            this.$watch(
              `$data.metaInfo.${type}.${key}`,
              createWatcher(type),
              { deep: true, immediate: true }
            )
          }
        }
      }

      if (this.$options.metaInfo) {
        this._vueMeta = {
          id: vueMetaComponentId++,
          depth: getComponentDepth(this),
          unwatch: []
        }

        if (typeof this.$options.metaInfo === 'function') {
          this.$watch(
            this.$options.metaInfo,
            (newValue) => updateMetaInfo(this, newValue),
            { immediate: true }
          )
          return
        }

        for (const type in this.$options.metaInfo) {
          const metaInfoForType = this.$options.metaInfo[type]

          if (typeof metaInfoForType === 'function') {
            this.$watch(
              metaInfoForType,
              (newValue) => updateMetaInfoForType(this, newValue, type),
              { deep: true, immediate: true }
            )

            continue
          }

          updateMetaInfoForType(this, metaInfoForType, type)
        }
      }
    },
    beforeDestroy() {
      onComponentDestroyed(this)
    }
  }
}
