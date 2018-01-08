// borrow the slice method
const toArray = Function.prototype.call.bind(Array.prototype.slice)

export default function _updateTags (options = {}) {
  const { attribute } = options

  /**
   * Updates meta tags inside <head> and <body> on the client. Borrowed from `react-helmet`:
   * https://github.com/nfl/react-helmet/blob/004d448f8de5f823d10f838b02317521180f34da/src/Helmet.js#L195-L245
   *
   * @param  {('meta'|'base'|'link'|'style'|'script'|'noscript')} type - the name of the tag
   * @param  {(Array<Object>|Object)} tags - an array of tag objects or a single object in case of base
   * @return {Object} - a representation of what tags changed
   */
  return function updateTags (type, tags, headTag, bodyTag) {
    const oldHeadTags = toArray(headTag.querySelectorAll(`${type}[${attribute}]`))
    const oldBodyTags = toArray(bodyTag.querySelectorAll(`${type}[${attribute}][data-body="true"]`))
    const newTags = []
    let indexToDelete

    if (tags.length > 1) {
      // remove duplicates that could have been found by merging tags
      // which include a mixin with metaInfo and that mixin is used
      // by multiple components on the same page
      const found = []
      tags = tags.map(x => {
        const k = JSON.stringify(x)
        if (found.indexOf(k) < 0) {
          found.push(k)
          return x
        }
      }).filter(x => x)
    }

    if (tags && tags.length) {
      tags.forEach((tag) => {
        const newElement = document.createElement(type)
        const oldTags = tag.body !== true ? oldHeadTags : oldBodyTags

        for (const attr in tag) {
          if (tag.hasOwnProperty(attr)) {
            if (attr === 'innerHTML') {
              newElement.innerHTML = tag.innerHTML
            } else if (attr === 'cssText') {
              if (newElement.styleSheet) {
                newElement.styleSheet.cssText = tag.cssText
              } else {
                newElement.appendChild(document.createTextNode(tag.cssText))
              }
            } else if ([options.tagIDKeyName, 'body'].indexOf(attr) !== -1) {
              const _attr = `data-${attr}`
              const value = (typeof tag[attr] === 'undefined') ? '' : tag[attr]
              newElement.setAttribute(_attr, value)
            } else {
              const value = (typeof tag[attr] === 'undefined') ? '' : tag[attr]
              newElement.setAttribute(attr, value)
            }
          }
        }

        newElement.setAttribute(attribute, 'true')

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
    const oldTags = oldHeadTags.concat(oldBodyTags)
    oldTags.forEach((tag) => tag.parentNode.removeChild(tag))
    newTags.forEach((tag) => {
      if (tag.getAttribute('data-body') === 'true') {
        bodyTag.appendChild(tag)
      } else {
        headTag.appendChild(tag)
      }
    })

    return { oldTags, newTags }
  }
}
