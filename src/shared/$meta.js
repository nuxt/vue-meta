import refresh from '../client/refresh'
import inject from '../server/inject'
import { showWarningNotSupported } from '../shared/log'
import { addApp } from './additional-app'
import { pause, resume } from './pausing'
import { getOptions } from './options'

export default function $meta (options = {}) {
  /**
   * Returns an injector for server-side rendering.
   * @this {Object} - the Vue instance (a root component)
   * @return {Object} - injector
   */
  return {
    getOptions: () => getOptions(options),
    refresh: () => refresh(this, options),
    inject: () => process.server ? inject(this, options) : showWarningNotSupported(),
    pause: () => pause(this),
    resume: () => resume(this),
    addApp: appId => addApp(this, appId, options)
  }
}
