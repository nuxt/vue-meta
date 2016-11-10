import assign from 'object-assign'
import $meta from './$meta'

import {
  VUE_META_KEY_NAME,
  VUE_META_ATTRIBUTE,
  VUE_META_SERVER_RENDERED_ATTRIBUTE,
  VUE_META_TAG_LIST_ID_KEY_NAME
} from './constants'

// automatic install
if (typeof Vue !== 'undefined') {
  Vue.use(VueMeta)
}

// set some default options
const defaultOptions = {
  keyName: VUE_META_KEY_NAME,
  attribute: VUE_META_ATTRIBUTE,
  ssrAttribute: VUE_META_SERVER_RENDERED_ATTRIBUTE,
  tagIDKeyName: VUE_META_TAG_LIST_ID_KEY_NAME
}

/**
 * Plugin install function.
 * @param {Function} Vue - the Vue constructor.
 */
export default function VueMeta (Vue, options = {}) {
  // combine options
  options = assign(defaultOptions, options)

  // bind the $meta method to this component instance
  Vue.prototype.$meta = $meta(options)

  // store an id to keep track of DOM updates
  let requestId = null

  // watch for client side component updates
  Vue.mixin({
    beforeMount () {
      // batch potential DOM updates to prevent extraneous re-rendering
      window.cancelAnimationFrame(requestId)

      requestId = window.requestAnimationFrame(() => {
        requestId = null
        this.$meta().refresh()
      })
    }
  })
}
