import { booleanHtmlAttributes } from '../../shared/constants'

/**
 * Generates tag attributes for use on the server.
 *
 * @param  {('bodyAttrs'|'htmlAttrs'|'headAttrs')} type - the type of attributes to generate
 * @param  {Object} data - the attributes to generate
 * @return {Object} - the attribute generator
 */
export default function attributeGenerator ({ attribute, ssrAttribute } = {}, type, data, addSrrAttribute) {
  let attributeStr = ''

  for (const attr in data) {
    const attrData = data[attr]
    const attrValues = []

    for (const appId in attrData) {
      attrValues.push(...[].concat(attrData[appId]))
    }

    if (attrValues.length) {
      attributeStr += booleanHtmlAttributes.includes(attr) && attrValues.some(Boolean)
        ? `${attr}`
        : `${attr}="${attrValues.join(' ')}"`

      attributeStr += ' '
    }
  }

  if (attributeStr) {
    attributeStr += `${attribute}="${encodeURI(JSON.stringify(data))}"`
  }

  if (type === 'htmlAttrs' && addSrrAttribute) {
    return `${ssrAttribute}${attributeStr ? ' ' : ''}${attributeStr}`
  }

  return attributeStr
}
