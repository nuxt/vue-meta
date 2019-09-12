import { getOptions } from '../shared/options'
import { pause, resume } from '../shared/pausing'
import refresh from '../client/refresh'
import inject from './inject'

export default function $meta (options = {}) {
  /**
   * Returns an injector for server-side rendering.
   * @this {Object} - the Vue instance (a root component)
   * @return {Object} - injector
   */
  return {
    getOptions: () => getOptions(options),
    refresh: () => refresh.call(this, options),
    inject: () => inject.call(this, options),
    pause: () => pause.call(this),
    resume: () => resume.call(this)
  }
}
