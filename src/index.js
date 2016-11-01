import $meta from './$meta'
import getMetaInfo from './getMetaInfo'
import updateClientMetaInfo from './updateClientMetaInfo'

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

  // watch for client side updates
  Vue.mixin({
    mounted () {
      updateClientMetaInfo(getMetaInfo(this.$root))
    }
  })
}
