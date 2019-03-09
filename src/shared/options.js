import { isObject, isFunction } from './is-type'
import { defaultOptions } from './constants'

export default function setOptions(options) {
  // combine options
  options = isObject(options) ? options : {}

  for (const key in defaultOptions) {
    if (!options[key]) {
      options[key] = defaultOptions[key]
    }
  }

  if (options.afterNavigation && !isFunction(options.afterNavigation)) {
    console.warn(`afterNavigation should be a function, received ${typeof options.afterNavigation} instead`) // eslint-disable-line no-console
    options.afterNavigation = void 0
    return options
  }

  if (options.afterNavigation && !options.refreshOnceOnNavigation) {
    options.refreshOnceOnNavigation = true
  }

  return options
}
