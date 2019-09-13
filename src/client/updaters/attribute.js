import { booleanHtmlAttributes } from '../../shared/constants'
import { includes } from '../../utils/array'

// keep a local map of attribute values
// instead of adding it to the html
export const attributeMap = {}

/**
 * Updates the document's html tag attributes
 *
 * @param  {Object} attrs - the new document html attributes
 * @param  {HTMLElement} tag - the HTMLElement tag to update with new attrs
 */
export default function updateAttribute (appId, { attribute } = {}, type, attrs, tag) {
  const vueMetaAttrString = tag.getAttribute(attribute)
  if (vueMetaAttrString) {
    attributeMap[type] = JSON.parse(decodeURI(vueMetaAttrString))
    tag.removeAttribute(attribute)
  }

  const data = attributeMap[type] || {}

  const toUpdate = []

  // remove attributes from the map
  // which have been removed for this appId
  for (const attr in data) {
    if (data[attr] && appId in data[attr]) {
      toUpdate.push(attr)

      if (!attrs[attr]) {
        delete data[attr][appId]
      }
    }
  }

  for (const attr in attrs) {
    const attrData = data[attr]

    if (!attrData || attrData[appId] !== attrs[attr]) {
      toUpdate.push(attr)

      if (attrs[attr]) {
        data[attr] = data[attr] || {}
        data[attr][appId] = attrs[attr]
      }
    }
  }

  for (const attr of toUpdate) {
    const attrData = data[attr]

    const attrValues = []
    for (const appId in attrData) {
      Array.prototype.push.apply(attrValues, [].concat(attrData[appId]))
    }

    if (attrValues.length) {
      const attrValue = includes(booleanHtmlAttributes, attr) && attrValues.some(Boolean)
        ? ''
        : attrValues.filter(Boolean).join(' ')

      tag.setAttribute(attr, attrValue)
    } else {
      tag.removeAttribute(attr)
    }
  }

  attributeMap[type] = data
}
