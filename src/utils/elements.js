import { toArray } from './array'

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

export function queryElements (parentNode, { appId, attribute, type, tagIDKeyName }, attributes = {}) {
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

  return toArray(parentNode.querySelectorAll(queries.join(', ')))
}
