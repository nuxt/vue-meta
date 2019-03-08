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

  headObject[contentKeyName] = isFunction(template)
    ? template.call(component, chunk)
    : template.replace(/%s/g, chunk)

  return true
}
