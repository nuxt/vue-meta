import { version } from '../package.json'
import createMixin from './shared/mixin'
import setOptions from './shared/options'
import { isUndefined } from './shared/typeof'
import $meta from './client/$meta'

/**
 * Plugin install function.
 * @param {Function} Vue - the Vue constructor.
 */
function VueMeta(Vue, options = {}) {
  options = setOptions(options)

  Vue.prototype.$meta = $meta(options)

  Vue.mixin(createMixin(options))
}

VueMeta.version = version

// automatic install
if (!isUndefined(window) && !isUndefined(window.Vue)) {
  /* istanbul ignore next */
  Vue.use(VueMeta)
}

export default VueMeta
