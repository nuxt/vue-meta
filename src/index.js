import { version } from '../package.json'
import { showWarningNotSupportedInBrowserBundle } from './shared/log'
import createMixin from './shared/mixin'
import { setOptions } from './shared/options'
import $meta from './shared/$meta'
import generate from './server/generate'
import { hasMetaInfo } from './shared/meta-helpers'

/**
 * Plugin install function.
 * @param {Function} Vue - the Vue constructor.
 */
function install (Vue, options = {}) {
  if (Vue.__vuemeta_installed) {
    return
  }
  Vue.__vuemeta_installed = true

  options = setOptions(options)

  Vue.prototype.$meta = function () {
    return $meta.call(this, options)
  }

  Vue.mixin(createMixin(Vue, options))
}

export default {
  version,
  install,
  generate: process.server ? generate : () => showWarningNotSupportedInBrowserBundle('generate'),
  hasMetaInfo
}
