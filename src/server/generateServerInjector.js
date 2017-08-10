import titleGenerator from './generators/titleGenerator'
import attrsGenerator from './generators/attrsGenerator'
import tagGenerator from './generators/tagGenerator'

export default function _generateServerInjector (options = {}) {
  /**
   * Converts a meta info property to one that can be stringified on the server
   *
   * @param  {String} type - the type of data to convert
   * @param  {(String|Object|Array<Object>)} data - the data value
   * @return {Object} - the new injector
   */
  return function generateServerInjector (type, data) {
    switch (type) {
      case 'title':
        return titleGenerator(options)(type, data)
      case 'htmlAttrs':
      case 'bodyAttrs':
      case 'headAttrs':
        return attrsGenerator(options)(type, data)
      default:
        return tagGenerator(options)(type, data)
    }
  }
}
