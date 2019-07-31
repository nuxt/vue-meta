import { isFunction, isObject } from '../utils/is-type'
import { defaultInfo } from './constants'
import { merge } from './merge'
import { inMetaInfoBranch } from './meta-helpers'

export function getComponentMetaInfo (options = {}, component) {
  return getComponentOption(options, component, defaultInfo)
}

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
export function getComponentOption (options = {}, component, result = {}, iter = 0) {
  const { keyName } = options
  const { $options, $children } = component

  if (component._inactive) {
    return result
  }

  // only collect option data if it exists
  if ($options[keyName]) {
    let data = $options[keyName]

    // if option is a function, replace it with it's result
    if (isFunction(data)) {
      data = data.call(component)
    }

    // ignore data if its not an object, then we keep our previous result
    if (!isObject(data)) {
      return result
    }

    // merge with existing options
    result = merge(result, data, options)
  }

  // collect & aggregate child options if deep = true
  if ($children.length) {
    $children.forEach((childComponent) => {
      // check if the childComponent is in a branch
      // return otherwise so we dont walk all component branches unnecessarily
      if (!inMetaInfoBranch(childComponent)) {
        return
      }

      result = getComponentOption(options, childComponent, result)
    })
  }

  return result
}
