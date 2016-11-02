import { VUE_META_ATTRIBUTE } from './constants'

/**
 * updates the document's html tag attributes
 *
 * @param  {Object} attrs - the new document html attributes
 * @param  {HTMLElement} tag - the HTMLElment tag to update with new attrs
 */
export default function updateTagAttributes (attrs, tag) {
  const vueMetaAttrString = tag.getAttribute(VUE_META_ATTRIBUTE)
  const vueMetaAttrs = vueMetaAttrString ? vueMetaAttrString.split(',') : []
  const toRemove = [].concat(vueMetaAttrs)
  for (let attr in attrs) {
    if (attrs.hasOwnProperty(attr)) {
      const val = attrs[attr] || ''
      tag.setAttribute(attr, val)
      if (vueMetaAttrs.indexOf(attr) === -1) {
        vueMetaAttrs.push(attr)
      }
      const saveIndex = toRemove.indexOf(attr)
      if (saveIndex !== -1) {
        toRemove.splice(saveIndex, 1)
      }
    }
  }
  let i = toRemove.length - 1
  for (; i >= 0; i--) {
    tag.removeAttribute(toRemove[i])
  }
  if (vueMetaAttrs.length === toRemove.length) {
    tag.removeAttribute(VUE_META_ATTRIBUTE)
  } else {
    tag.setAttribute(VUE_META_ATTRIBUTE, vueMetaAttrs.join(','))
  }
}
