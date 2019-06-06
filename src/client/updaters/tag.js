import { isUndefined } from '../../utils/is-type'
import { toArray, includes } from '../../utils/array'

/**
 * Updates meta tags inside <head> and <body> on the client. Borrowed from `react-helmet`:
 * https://github.com/nfl/react-helmet/blob/004d448f8de5f823d10f838b02317521180f34da/src/Helmet.js#L195-L245
 *
 * @param  {('meta'|'base'|'link'|'style'|'script'|'noscript')} type - the name of the tag
 * @param  {(Array<Object>|Object)} tags - an array of tag objects or a single object in case of base
 * @return {Object} - a representation of what tags changed
 */
export default function updateTag(appId, { attribute, tagIDKeyName } = {}, type, tags, headTag, bodyTag) {
  const oldHeadTags = toArray(headTag.querySelectorAll(`${type}[${attribute}="${appId}"], ${type}[data-${tagIDKeyName}]`))
  const oldBodyTags = toArray(bodyTag.querySelectorAll(`${type}[${attribute}="${appId}"][data-body="true"], ${type}[data-${tagIDKeyName}][data-body="true"]`))
  const dataAttributes = [tagIDKeyName, 'body']
  const newTags = []

  if (tags.length > 1) {
    // remove duplicates that could have been found by merging tags
    // which include a mixin with metaInfo and that mixin is used
    // by multiple components on the same page
    const found = []
    tags = tags.filter((x) => {
      const k = JSON.stringify(x)
      const res = !includes(found, k)
      found.push(k)
      return res
    })
  }

  if (tags.length) {
    tags.forEach((tag) => {
      const newElement = document.createElement(type)

      newElement.setAttribute(attribute, appId)

      const oldTags = tag.body !== true ? oldHeadTags : oldBodyTags

      for (const attr in tag) {
        if (tag.hasOwnProperty(attr)) {
          if (attr === 'innerHTML') {
            newElement.innerHTML = tag.innerHTML
          } else if (attr === 'cssText') {
            if (newElement.styleSheet) {
              /* istanbul ignore next */
              newElement.styleSheet.cssText = tag.cssText
            } else {
              newElement.appendChild(document.createTextNode(tag.cssText))
            }
          } else {
            const _attr = includes(dataAttributes, attr)
              ? `data-${attr}`
              : attr
            const value = isUndefined(tag[attr]) ? '' : tag[attr]
            newElement.setAttribute(_attr, value)
          }
        }
      }

      // Remove a duplicate tag from domTagstoRemove, so it isn't cleared.
      let indexToDelete
      const hasEqualElement = oldTags.some((existingTag, index) => {
        indexToDelete = index
        return newElement.isEqualNode(existingTag)
      })

      if (hasEqualElement && (indexToDelete || indexToDelete === 0)) {
        oldTags.splice(indexToDelete, 1)
      } else {
        newTags.push(newElement)
      }
    })
  }

  const oldTags = oldHeadTags.concat(oldBodyTags)
  oldTags.forEach(tag => tag.parentNode.removeChild(tag))
  newTags.forEach((tag) => {
    if (tag.getAttribute('data-body') === 'true') {
      bodyTag.appendChild(tag)
    } else {
      headTag.appendChild(tag)
    }
  })

  return { oldTags, newTags }
}
