import { booleanHtmlAttributes } from '../../shared/constants'
import { isUndefined, isArray } from '../../utils/is-type'

/**
 * Generates tag attributes for use on the server.
 *
 * @param  {('bodyAttrs'|'htmlAttrs'|'headAttrs')} type - the type of attributes to generate
 * @param  {Object} data - the attributes to generate
 * @return {Object} - the attribute generator
 */
export default function attributeGenerator ({ attribute, ssrAttribute } = {}, type, data) {
  return {
    text (addSrrAttribute) {
      let attributeStr = ''
      const watchedAttrs = []

      for (const attr in data) {
        if (data.hasOwnProperty(attr)) {
          watchedAttrs.push(attr)

          attributeStr += isUndefined(data[attr]) || booleanHtmlAttributes.includes(attr)
            ? attr
            : `${attr}="${isArray(data[attr]) ? data[attr].join(' ') : data[attr]}"`

          attributeStr += ' '
        }
      }

      if (attributeStr) {
        attributeStr += `${attribute}="${(watchedAttrs.sort()).join(',')}"`
      }

      if (type === 'htmlAttrs' && addSrrAttribute) {
        return `${ssrAttribute}${attributeStr ? ' ' : ''}${attributeStr}`
      }

      return attributeStr
    }
  }
}
