import { version } from '../package.json'
import createMixin from './shared/mixin'
import { setOptions } from './shared/options'
import { isUndefined } from './utils/is-type'
import $meta from './client/$meta'
import { hasMetaInfo } from './shared/meta-helpers'

/**
 * Plugin install function.
 * @param {Function} Vue - the Vue constructor.
 */
function install(Vue, options = {}) {
  if (Vue.__vuemeta_installed) {
    return
  }
  Vue.__vuemeta_installed = true

  options = setOptions(options)

  Vue.prototype.$meta = $meta(options)

  Vue.mixin(createMixin(Vue, options))
}

// automatic install
if (!isUndefined(window) && !isUndefined(window.Vue)) {
  /* istanbul ignore next */
  install(window.Vue)
}

export default {
  version,
  install,
  hasMetaInfo
}
