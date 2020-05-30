import refresh from '../client/refresh'
import inject from '../server/inject'
import { addApp } from './additional-app'
import { showWarningNotSupportedInBrowserBundle } from './log'
import { addNavGuards } from './nav-guards'
import { pause, resume } from './pausing'
import { getOptions } from './options'

export default function $meta (options) {
  options = options || {}
  /**
   * Returns an injector for server-side rendering.
   * @this {Object} - the Vue instance (a root component)
   * @return {Object} - injector
   */
  const $root = this.$root

  return {
    getOptions: () => getOptions(options),
    setOptions: (newOptions) => {
      const refreshNavKey = 'refreshOnceOnNavigation'
      if (newOptions && newOptions[refreshNavKey]) {
        options.refreshOnceOnNavigation = !!newOptions[refreshNavKey]
        addNavGuards($root)
      }

      const debounceWaitKey = 'debounceWait'
      if (newOptions && debounceWaitKey in newOptions) {
        const debounceWait = parseInt(newOptions[debounceWaitKey])
        if (!isNaN(debounceWait)) {
          options.debounceWait = debounceWait
        }
      }

      const waitOnDestroyedKey = 'waitOnDestroyed'
      if (newOptions && waitOnDestroyedKey in newOptions) {
        options.waitOnDestroyed = !!newOptions[waitOnDestroyedKey]
      }
    },
    refresh: () => refresh($root, options),
    inject: injectOptions => process.server ? inject($root, options, injectOptions) : showWarningNotSupportedInBrowserBundle('inject'),
    pause: () => pause($root),
    resume: () => resume($root),
    addApp: appId => addApp($root, appId, options)
  }
}
