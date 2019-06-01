import { showWarningNotSupported } from '../shared/constants'
import { getOptions } from '../shared/options'
import { pause, resume } from '../shared/pausing'
import refresh from '../client/refresh'
import inject from './inject'

export default function _$meta(options = {}) {
  const _refresh = refresh(options)
  const _inject = inject(options)

  /**
   * Returns an injector for server-side rendering.
   * @this {Object} - the Vue instance (a root component)
   * @return {Object} - injector
   */
  return function $meta() {
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
      refresh: _refresh.bind(this),
      inject: _inject.bind(this),
      pause: pause.bind(this),
      resume: resume.bind(this)
    }
  }
}
