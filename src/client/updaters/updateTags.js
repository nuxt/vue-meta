import { VUE_META_ATTRIBUTE } from '../../shared/constants'

// borrow the slice method
const toArray = Function.prototype.call.bind(Array.prototype.slice)

/**
 * Updates meta tags inside <head> on the client. Borrowed from `react-helmet`:
 * https://github.com/nfl/react-helmet/blob/004d448f8de5f823d10f838b02317521180f34da/src/Helmet.js#L195-L245
 *
 * @param  {('meta'|'base'|'link'|'style'|'script'|'noscript')} type - the name of the tag
 * @param  {(Array<Object>|Object)} tags - an array of tag objects or a single object in case of base
 * @return {Object} - a representation of what tags changed
 */
export default function updateTags (type, tags, headTag) {
  const nodes = headTag.querySelectorAll(`${type}[${VUE_META_ATTRIBUTE}]`)
  const oldTags = toArray(nodes)
  const newTags = []
  let indexToDelete

  if (tags && tags.length) {
    tags.forEach((tag) => {
      const newElement = document.createElement(type)

      for (const attribute in tag) {
        if (tag.hasOwnProperty(attribute)) {
          if (attribute === 'innerHTML') {
            newElement.innerHTML = tag.innerHTML
          } else if (attribute === 'cssText') {
            if (newElement.styleSheet) {
              newElement.styleSheet.cssText = tag.cssText
            } else {
              newElement.appendChild(document.createTextNode(tag.cssText))
            }
          } else {
            const value = (typeof tag[attribute] === 'undefined') ? '' : tag[attribute]
            newElement.setAttribute(attribute, value)
          }
        }
      }

      newElement.setAttribute(VUE_META_ATTRIBUTE, 'true')

      // Remove a duplicate tag from domTagstoRemove, so it isn't cleared.
      if (oldTags.some((existingTag, index) => {
        indexToDelete = index
        return newElement.isEqualNode(existingTag)
      })) {
        oldTags.splice(indexToDelete, 1)
      } else {
        newTags.push(newElement)
      }
    })
  }

  oldTags.forEach((tag) => tag.parentNode.removeChild(tag))
  newTags.forEach((tag) => headTag.appendChild(tag))

  return { oldTags, newTags }
}
