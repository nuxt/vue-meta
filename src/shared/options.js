import { isObject, isFunction } from './is-type'

import {
  keyName,
  attribute,
  ssrAttribute,
  tagIDKeyName,
  metaTemplateKeyName,
  contentKeyName
} from './constants'

// set some default options
const defaultOptions = {
  keyName,
  contentKeyName,
  metaTemplateKeyName,
  attribute,
  ssrAttribute,
  tagIDKeyName
}

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
