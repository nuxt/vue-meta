import { toArray } from './array'

export const querySelector = (arg, el) => (el || document).querySelectorAll(arg)

export function getTag (tags, tag) {
  if (!tags[tag]) {
    tags[tag] = document.getElementsByTagName(tag)[0]
  }

  return tags[tag]
}

export function getElementsKey ({ body, pbody }) {
  return body
    ? 'body'
    : (pbody ? 'pbody' : 'head')
}

export function queryElements (parentNode, { appId, attribute, type, tagIDKeyName }, attributes) {
  attributes = attributes || {}

  const queries = [
    `${type}[${attribute}="${appId}"]`,
    `${type}[data-${tagIDKeyName}]`
  ].map((query) => {
    for (const key in attributes) {
      const val = attributes[key]
      const attributeValue = val && val !== true ? `="${val}"` : ''
      query += `[data-${key}${attributeValue}]`
    }
    return query
  })

  return toArray(querySelector(queries.join(', '), parentNode))
}

export function removeElementsByAppId ({ attribute }, appId) {
  toArray(querySelector(`[${attribute}="${appId}"]`)).map(el => el.remove())
}

export function removeAttribute (el, attributeName) {
  el.removeAttribute(attributeName)
}
