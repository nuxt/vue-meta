import { version } from '../package.json'
import createMixin from './shared/mixin'
import { setOptions } from './shared/options'
import $meta from './server/$meta'
import { hasMetaInfo } from './shared/meta-helpers'

/**
 * Plugin install function.
 * @param {Function} Vue - the Vue constructor.
 */
function install(Vue, options = {}) {
  options = setOptions(options)

  Vue.prototype.$meta = $meta(options)

  Vue.mixin(createMixin(Vue, options))
}

export default {
  version,
  install,
  hasMetaInfo
}
