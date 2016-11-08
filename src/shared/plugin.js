import getMetaInfo from './getMetaInfo'
import $meta from '../server/$meta'
import updateClientMetaInfo from '../client/updateClientMetaInfo'

// automatic install
if (typeof Vue !== 'undefined') {
  Vue.use(VueMeta)
}

/**
 * Plugin install function.
 * @param {Function} Vue - the Vue constructor.
 */
export default function VueMeta (Vue) {
  // bind the $meta method to this component instance
  Vue.prototype.$meta = $meta

  // store an id to keep track of DOM updates
  let requestId = null

  // watch for client side component updates
  Vue.mixin({
    beforeMount () {
      // batch potential DOM updates to prevent extraneous re-rendering
      window.cancelAnimationFrame(requestId)

      requestId = window.requestAnimationFrame(() => {
        requestId = null
        const info = getMetaInfo(this.$root)

        // update the meta info
        updateClientMetaInfo(info)
      })
    }
  })
}
