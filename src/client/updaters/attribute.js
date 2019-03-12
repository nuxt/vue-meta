import { booleanHtmlAttributes } from '../../shared/constants'
import { toArray, includes } from '../../utils/array'
import { isArray } from '../../utils/is-type'

/**
 * Updates the document's html tag attributes
 *
 * @param  {Object} attrs - the new document html attributes
 * @param  {HTMLElement} tag - the HTMLElement tag to update with new attrs
 */
export default function updateAttribute({ attribute } = {}, attrs, tag) {
  const vueMetaAttrString = tag.getAttribute(attribute)
  const vueMetaAttrs = vueMetaAttrString ? vueMetaAttrString.split(',') : []
  const toRemove = toArray(vueMetaAttrs)

  const keepIndexes = []
  for (const attr in attrs) {
    if (attrs.hasOwnProperty(attr)) {
      const value = includes(booleanHtmlAttributes, attr)
        ? ''
        : isArray(attrs[attr]) ? attrs[attr].join(' ') : attrs[attr]

      tag.setAttribute(attr, value || '')

      if (!includes(vueMetaAttrs, attr)) {
        vueMetaAttrs.push(attr)
      }

      // filter below wont ever check -1
      keepIndexes.push(toRemove.indexOf(attr))
    }
  }

  const removedAttributesCount = toRemove
    .filter((el, index) => !includes(keepIndexes, index))
    .reduce((acc, attr) => {
      tag.removeAttribute(attr)
      return acc + 1
    }, 0)

  if (vueMetaAttrs.length === removedAttributesCount) {
    tag.removeAttribute(attribute)
  } else {
    tag.setAttribute(attribute, (vueMetaAttrs.sort()).join(','))
  }
}
