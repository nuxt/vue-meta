import { isObject } from '../shared/typeof'
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

  return options
}
