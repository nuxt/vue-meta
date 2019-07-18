import { booleanHtmlAttributes, commonDataAttributes } from '../../shared/constants'
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
export default function updateTag (appId, options = {}, type, tags, head, body) {
  const { attribute, tagIDKeyName } = options

  const dataAttributes = [tagIDKeyName, ...commonDataAttributes]
  const newElements = []

  const queryOptions = { appId, attribute, type, tagIDKeyName }
  const currentElements = {
    head: queryElements(head, queryOptions),
    pbody: queryElements(body, queryOptions, { pbody: true }),
    body: queryElements(body, queryOptions, { body: true })
  }

  const usedTags = []

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
    for (const tag of tags) {
      if (tag.skip) {
        continue
      }

      const newElement = document.createElement(type)
      newElement.setAttribute(attribute, appId)

      for (const attr in tag) {
        if (!tag.hasOwnProperty(attr) || attr === 'skip') {
          continue
        }

        if (attr === 'innerHTML') {
          newElement.innerHTML = tag.innerHTML
          continue
        }

        if (attr === 'cssText') {
          if (newElement.styleSheet) {
            /* istanbul ignore next */
            newElement.styleSheet.cssText = tag.cssText
          } else {
            newElement.appendChild(document.createTextNode(tag.cssText))
          }
          continue
        }

        if (attr === 'callback') {
          newElement.onload = () => tag[attr](newElement)
          continue
        }

        const _attr = includes(dataAttributes, attr)
          ? `data-${attr}`
          : attr

        const isBooleanAttribute = includes(booleanHtmlAttributes, attr)
        if (isBooleanAttribute && !tag[attr]) {
          continue
        }

        const value = isBooleanAttribute ? '' : tag[attr]
        newElement.setAttribute(_attr, value)
      }

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
        usedTags.push(tag)
      }
    }
  }

  let oldElements = []
  for (const current of Object.values(currentElements)) {
    oldElements = [
      ...oldElements,
      ...current
    ]
  }

  // remove old elements
  for (const element of oldElements) {
    element.parentNode.removeChild(element)
  }

  // insert new elements
  for (const element of newElements) {
    if (element.hasAttribute('data-body')) {
      body.appendChild(element)
      continue
    }

    if (element.hasAttribute('data-pbody')) {
      body.insertBefore(element, body.firstChild)
      continue
    }

    head.appendChild(element)
  }

  return {
    oldTags: oldElements,
    newTags: newElements
  }
}
