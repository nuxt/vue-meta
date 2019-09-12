import { showWarningNotSupported } from '../shared/log'
import { getOptions } from '../shared/options'
import { pause, resume } from '../shared/pausing'
import refresh from './refresh'

export default function $meta (options = {}) {
  /**
   * Returns an injector for server-side rendering.
   * @this {Object} - the Vue instance (a root component)
   * @return {Object} - injector
   */
  if (!this.$root._vueMeta) {
    return {
      getOptions: showWarningNotSupported,
      refresh: showWarningNotSupported,
      inject: showWarningNotSupported,
      pause: showWarningNotSupported,
      resume: showWarningNotSupported
    }
  }

  return {
    getOptions: () => getOptions(options),
    refresh: () => refresh.call(this, options),
    inject: () => {},
    pause: () => pause.call(this),
    resume: () => resume.call(this)
  }
}
