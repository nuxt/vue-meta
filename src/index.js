import { version } from '../package.json'
import { showWarningNotSupportedInBrowserBundle } from './shared/log'
import createMixin from './shared/mixin'
import { setOptions } from './shared/options'
import $meta from './shared/$meta'
import generate from './server/generate'
import { hasMetaInfo } from './shared/meta-helpers'
import { isUndefined } from './utils/is-type'

/**
 * Plugin install function.
 * @param {Function} Vue - the Vue constructor.
 */
function install (Vue, options) {
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

if (process.client) {
  // automatic install if window.Vue is not undefined
  // it can be skipped by setting `window.vueMetaSkipAutoInstall = true` before load vue-meta script
  if (!isUndefined(window) && !isUndefined(window.Vue) && !window.vueMetaSkipAutoInstall) {
    /* istanbul ignore next */
    install(window.Vue)
  }
}

export default {
  version,
  install,
  generate: (metaInfo, options) => process.server ? generate(metaInfo, options) : showWarningNotSupportedInBrowserBundle('generate'),
  hasMetaInfo
}
