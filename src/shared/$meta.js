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
    'getOptions': () => getOptions(options),
    'setOptions': (newOptions) => {
      const refreshNavKey = 'refreshOnceOnNavigation'
      if (newOptions && newOptions[refreshNavKey]) {
        options.refreshOnceOnNavigation = newOptions[refreshNavKey]
        addNavGuards($root)
      }

      const debounceWaitKey = 'debounceWait'
      if (newOptions && newOptions[debounceWaitKey]) {
        const debounceWait = parseInt(newOptions[debounceWaitKey])
        if (!isNaN(debounceWait)) {
          options.debounceWait = debounceWait
        }
      }
    },
    'refresh': () => refresh($root, options),
    'inject': () => process.server ? inject($root, options) : showWarningNotSupportedInBrowserBundle('inject'),
    'pause': () => pause($root),
    'resume': () => resume($root),
    'addApp': appId => addApp($root, appId, options)
  }
}
