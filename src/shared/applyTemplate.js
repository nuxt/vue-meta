import { isUndefined, isFunction } from './typeof'

export default function applyTemplate({ component, metaTemplateKeyName, contentKeyName }, headObject, template, chunk) {
  if (isUndefined(template)) {
    template = headObject[metaTemplateKeyName]
    delete headObject[metaTemplateKeyName]
  }

  // return early if no template defined
  if (!template) {
    return false
  }

  if (isUndefined(chunk)) {
    chunk = headObject[contentKeyName]
  }

  if (isFunction(template)) {
    headObject[contentKeyName] = template.call(component, chunk)
  } else {
    headObject[contentKeyName] = template.replace(/%s/g, chunk)
  }
  return true
}
