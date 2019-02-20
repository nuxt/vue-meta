import deepmerge from 'deepmerge'
import uniqueId from 'lodash.uniqueid'
import { isUndefined, isFunction, isObject } from './typeof'
import uniqBy from './uniqBy'

/**
 * Returns the `opts.option` $option value of the given `opts.component`.
 * If methods are encountered, they will be bound to the component context.
 * If `opts.deep` is true, will recursively merge all child component
 * `opts.option` $option values into the returned result.
 *
 * @param  {Object} opts - options
 * @param  {Object} opts.component - Vue component to fetch option data from
 * @param  {Boolean} opts.deep - look for data in child components as well?
 * @param  {Function} opts.arrayMerge - how should arrays be merged?
 * @param  {String} opts.keyName - the name of the option to look for
 * @param  {Object} [result={}] - result so far
 * @return {Object} result - final aggregated result
 */
export default function getComponentOption({ component, deep, arrayMerge, keyName, metaTemplateKeyName, tagIDKeyName, contentKeyName } = {}, result = {}) {
  const { $options } = component

  if (component._inactive) {
    return result
  }

  // only collect option data if it exists
  if (!isUndefined($options[keyName]) && $options[keyName] !== null) {
    let data = $options[keyName]

    // if option is a function, replace it with it's result
    if (isFunction(data)) {
      data = data.call(component)
    }

    if (isObject(data)) {
      // merge with existing options
      result = deepmerge(result, data, { arrayMerge })
    } else {
      result = data
    }
  }

  // collect & aggregate child options if deep = true
  if (deep && component.$children.length) {
    component.$children.forEach((childComponent) => {
      result = getComponentOption({
        component: childComponent,
        keyName,
        deep,
        arrayMerge
      }, result)
    })
  }

  if (metaTemplateKeyName && result.hasOwnProperty('meta')) {
    result.meta = Object.keys(result.meta).map((metaKey) => {
      const metaObject = result.meta[metaKey]
      if (!metaObject.hasOwnProperty(metaTemplateKeyName) || !metaObject.hasOwnProperty(contentKeyName) || isUndefined(metaObject[metaTemplateKeyName])) {
        return result.meta[metaKey]
      }

      const template = metaObject[metaTemplateKeyName]
      delete metaObject[metaTemplateKeyName]

      if (template) {
        metaObject.content = isFunction(template) ? template(metaObject.content) : template.replace(/%s/g, metaObject.content)
      }

      return metaObject
    })
    result.meta = uniqBy(
      result.meta,
      metaObject => metaObject.hasOwnProperty(tagIDKeyName) ? metaObject[tagIDKeyName] : uniqueId()
    )
  }
  return result
}
