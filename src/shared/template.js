import { isUndefined, isFunction } from '../utils/is-type'

export function applyTemplate ({ component, metaTemplateKeyName, contentKeyName }, headObject, template, chunk) {
  if (template === true || headObject[metaTemplateKeyName] === true) {
    // abort, template was already applied
    return false
  }

  if (isUndefined(template) && headObject[metaTemplateKeyName]) {
    template = headObject[metaTemplateKeyName]
    headObject[metaTemplateKeyName] = true
  }

  // return early if no template defined
  if (!template) {
    // cleanup faulty template properties
    delete headObject[metaTemplateKeyName]
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
