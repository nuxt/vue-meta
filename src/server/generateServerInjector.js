import { metaInfoAttributeKeys } from '../shared/constants'
import { titleGenerator, attributeGenerator, tagGenerator } from './generators'

/**
 * Converts a meta info property to one that can be stringified on the server
 *
 * @param  {String} type - the type of data to convert
 * @param  {(String|Object|Array<Object>)} data - the data value
 * @return {Object} - the new injector
 */

export default function generateServerInjector (appId, options, type, data) {
  if (type === 'title') {
    return titleGenerator(appId, options, type, data)
  }

  if (metaInfoAttributeKeys.includes(type)) {
    return attributeGenerator(options, type, data)
  }

  return tagGenerator(appId, options, type, data)
}
