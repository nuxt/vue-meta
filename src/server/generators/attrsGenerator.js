import { VUE_META_ATTRIBUTE } from '../../shared/constants'

/**
 * Generates tag attributes for use on the server.
 *
 * @param  {('bodyAttrs'|'htmlAttrs')} type - the type of attributes to generate
 * @param  {Object} data - the attributes to generate
 * @return {Object} - the attribute generator
 */
export default function attrsGenerator (type, data) {
  return {
    text () {
      let attributeStr = ''
      let watchedAttrs = []
      for (let attr in data) {
        if (data.hasOwnProperty(attr)) {
          watchedAttrs.push(attr)
          attributeStr += `${
            typeof data[attr] !== 'undefined'
              ? `${attr}="${data[attr]}"`
              : attr
          } `
        }
      }
      attributeStr += `${VUE_META_ATTRIBUTE}="${watchedAttrs.join(',')}"`
      return attributeStr.trim()
    }
  }
}
