import { isObject } from '../utils/is-type'
import { defaultOptions } from './constants'

export function setOptions (options) {
  // combine options
  options = isObject(options) ? options : {}

  // The options are set like this so they can
  // be minified by terser while keeping the
  // user api intact
  // terser --mangle-properties keep_quoted=strict
  /* eslint-disable dot-notation */
  return {
    keyName: options['keyName'] || defaultOptions.keyName,
    attribute: options['attribute'] || defaultOptions.attribute,
    ssrAttribute: options['ssrAttribute'] || defaultOptions.ssrAttribute,
    tagIDKeyName: options['tagIDKeyName'] || defaultOptions.tagIDKeyName,
    contentKeyName: options['contentKeyName'] || defaultOptions.contentKeyName,
    metaTemplateKeyName: options['metaTemplateKeyName'] || defaultOptions.metaTemplateKeyName,
    debounceWait: options['debounceWait'] || defaultOptions.debounceWait,
    ssrAppId: options['ssrAppId'] || defaultOptions.ssrAppId,
    refreshOnceOnNavigation: !!options['refreshOnceOnNavigation']
  }
  /* eslint-enable dot-notation */
}

export function getOptions (options) {
  const optionsCopy = {}
  for (const key in options) {
    optionsCopy[key] = options[key]
  }
  return optionsCopy
}
