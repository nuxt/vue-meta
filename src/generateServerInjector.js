import { VUE_META_ATTRIBUTE } from './constants'

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
      return {
        text: () => `<${type} ${VUE_META_ATTRIBUTE}="true">${data}</${type}>`
      }
    case 'htmlAttrs':
    case 'bodyAttrs':
      return {
        text () {
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
