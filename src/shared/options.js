import { isObject } from '../utils/is-type'
import { defaultOptions } from './constants'

export function setOptions (options) {
  // combine options
  options = isObject(options) ? options : {}

  for (const key in defaultOptions) {
    if (!options[key]) {
      options[key] = defaultOptions[key]
    }
  }

  return options
}

export function getOptions (options) {
  const optionsCopy = {}
  for (const key in options) {
    optionsCopy[key] = options[key]
  }
  return optionsCopy
}
