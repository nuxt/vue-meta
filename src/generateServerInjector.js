import { VUE_META_ATTRIBUTE } from './constants'

/**
 * Converts a meta info property to one that can be stringified on the server
 *
 * @param  {String} type - the type of data to convert
 * @param  {(String|Object|Array<Object>)} data - the data value
 * @return {Object} - the new injector
 */
export default function generateServerInjector (type, data) {
  console.log('server injector called for', type, 'with', data)
  switch (type) {
    case 'title':
      return {
        toString: () => `<${type} ${VUE_META_ATTRIBUTE}="true">${data}</${type}>`
      }
    case 'htmlAttrs': {
      return {
        toString () {
          let attributeStr = ''
          let watchedAttrs = []
          for (let attr in data) {
            if (data.hasOwnProperty(attr)) {
              watchedAttrs.push(attr)
              attributeStr += `${typeof data[attr] !== 'undefined' ? `${attr}="${data[attr]}"` : attr} `
            }
          }
          attributeStr += `${VUE_META_ATTRIBUTE}="${watchedAttrs.join(',')}"`
          return attributeStr.trim()
        }
      }
    }
  }
}
