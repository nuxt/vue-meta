/**
 * Updates the document's html tag attributes
 *
 * @param  {Object} attrs - the new document html attributes
 * @param  {HTMLElement} tag - the HTMLElement tag to update with new attrs
 */
export default function updateAttribute({ attribute } = {}, attrs, tag) {
  const vueMetaAttrString = tag.getAttribute(attribute)
  const vueMetaAttrs = vueMetaAttrString ? vueMetaAttrString.split(',') : []
  const toRemove = [].concat(vueMetaAttrs)

  for (const attr in attrs) {
    if (attrs.hasOwnProperty(attr)) {
      const val = attrs[attr] || ''
      tag.setAttribute(attr, val)

      if (!vueMetaAttrs.includes(attr)) {
        vueMetaAttrs.push(attr)
      }

      const keepIndex = toRemove.indexOf(attr)
      if (keepIndex !== -1) {
        toRemove.splice(keepIndex, 1)
      }
    }
  }

  toRemove.forEach(attr => tag.removeAttribute(attr))

  if (vueMetaAttrs.length === toRemove.length) {
    tag.removeAttribute(attribute)
  } else {
    tag.setAttribute(attribute, (vueMetaAttrs.sort()).join(','))
  }
}
