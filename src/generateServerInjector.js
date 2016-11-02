import titleGenerator from './titleGenerator'
import attrsGenerator from './attrsGenerator'

/**
 * Converts a meta info property to one that can be stringified on the server
 *
 * @param  {String} type - the type of data to convert
 * @param  {(String|Object|Array<Object>)} data - the data value
 * @return {Object} - the new injector
 */
export default function generateServerInjector (type, data) {
  switch (type) {
    case 'title':
      return titleGenerator(type, data)
    case 'htmlAttrs':
    case 'bodyAttrs':
      return attrsGenerator(type, data)
  }
}
