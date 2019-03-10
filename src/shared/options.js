import { isObject } from '../utils/is-type'
import { defaultOptions } from './constants'

export default function setOptions(options) {
  // combine options
  options = isObject(options) ? options : {}

  for (const key in defaultOptions) {
    if (!options[key]) {
      options[key] = defaultOptions[key]
    }
  }

  return options
}
