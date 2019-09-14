import { booleanHtmlAttributes, commonDataAttributes, tagProperties } from '../../shared/constants'
import { includes } from '../../utils/array'
import { queryElements, getElementsKey } from '../../utils/elements.js'

/**
 * Updates meta tags inside <head> and <body> on the client. Borrowed from `react-helmet`:
 * https://github.com/nfl/react-helmet/blob/004d448f8de5f823d10f838b02317521180f34da/src/Helmet.js#L195-L245
 *
 * @param  {('meta'|'base'|'link'|'style'|'script'|'noscript')} type - the name of the tag
 * @param  {(Array<Object>|Object)} tags - an array of tag objects or a single object in case of base
 * @return {Object} - a representation of what tags changed
 */
export default function updateTag (appId, options, type, tags, head, body) {
  const { attribute, tagIDKeyName } = options || {}

  const dataAttributes = commonDataAttributes.slice()
  dataAttributes.push(tagIDKeyName)

  const newElements = []

  const queryOptions = { appId, attribute, type, tagIDKeyName }
  const currentElements = {
    head: queryElements(head, queryOptions),
    pbody: queryElements(body, queryOptions, { pbody: true }),
    body: queryElements(body, queryOptions, { body: true })
  }

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

  tags.forEach((tag) => {
    if (tag.skip) {
      return
    }

    const newElement = document.createElement(type)
    newElement.setAttribute(attribute, appId)

    Object.keys(tag).forEach((attr) => {
      /* istanbul ignore next */
      if (includes(tagProperties, attr)) {
        return
      }

      if (attr === 'innerHTML') {
        newElement.innerHTML = tag.innerHTML
        return
      }

      if (attr === 'json') {
        newElement.innerHTML = JSON.stringify(tag.json)
        return
      }

      if (attr === 'cssText') {
        if (newElement.styleSheet) {
          /* istanbul ignore next */
          newElement.styleSheet.cssText = tag.cssText
        } else {
          newElement.appendChild(document.createTextNode(tag.cssText))
        }
        return
      }

      if (attr === 'callback') {
        newElement.onload = () => tag[attr](newElement)
        return
      }

      const _attr = includes(dataAttributes, attr)
        ? `data-${attr}`
        : attr

      const isBooleanAttribute = includes(booleanHtmlAttributes, attr)
      if (isBooleanAttribute && !tag[attr]) {
        return
      }

      const value = isBooleanAttribute ? '' : tag[attr]
      newElement.setAttribute(_attr, value)
    })

    const oldElements = currentElements[getElementsKey(tag)]

    // Remove a duplicate tag from domTagstoRemove, so it isn't cleared.
    let indexToDelete
    const hasEqualElement = oldElements.some((existingTag, index) => {
      indexToDelete = index
      return newElement.isEqualNode(existingTag)
    })

    if (hasEqualElement && (indexToDelete || indexToDelete === 0)) {
      oldElements.splice(indexToDelete, 1)
    } else {
      newElements.push(newElement)
    }
  })

  const oldElements = []
  for (const type in currentElements) {
    Array.prototype.push.apply(oldElements, currentElements[type])
  }

  // remove old elements
  oldElements.forEach((element) => {
    element.parentNode.removeChild(element)
  })

  // insert new elements
  newElements.forEach((element) => {
    if (element.hasAttribute('data-body')) {
      body.appendChild(element)
      return
    }

    if (element.hasAttribute('data-pbody')) {
      body.insertBefore(element, body.firstChild)
      return
    }

    head.appendChild(element)
  })

  return {
    oldTags: oldElements,
    newTags: newElements
  }
}
