export default function _updateTagAttributes (options = {}) {
  const { attribute } = options

  /**
   * Updates the document's html tag attributes
   *
   * @param  {Object} attrs - the new document html attributes
   * @param  {HTMLElement} tag - the HTMLElement tag to update with new attrs
   */
  return function updateTagAttributes (attrs, tag) {
    const vueMetaAttrString = tag.getAttribute(attribute)
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
      tag.removeAttribute(attribute)
    } else {
      tag.setAttribute(attribute, vueMetaAttrs.join(','))
    }
  }
}
