import { metaInfoOptionKeys, metaInfoAttributeKeys, defaultInfo } from '../shared/constants'
import { titleGenerator, attributeGenerator, tagGenerator } from './generators'

/**
 * Converts a meta info property to one that can be stringified on the server
 *
 * @param  {String} type - the type of data to convert
 * @param  {(String|Object|Array<Object>)} data - the data value
 * @return {Object} - the new injector
 */

export default function generateServerInjector (options, newInfo) {
  for (const type in defaultInfo) {
    if (metaInfoOptionKeys.includes(type)) {
      continue
    }

    if (type === 'title') {
      newInfo[type] = titleGenerator(options, type, newInfo[type])
      continue
    }

    if (metaInfoAttributeKeys.includes(type)) {
      newInfo[type] = attributeGenerator(options, type, newInfo[type])
      continue
    }

    newInfo[type] = tagGenerator(options, type, newInfo[type])
  }

  return newInfo
}
