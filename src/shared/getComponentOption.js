import { isObject } from '../utils/is-type'
import { defaultInfo } from './constants'
import { merge } from './merge'
import { inMetaInfoBranch } from './meta-helpers'

export function getComponentMetaInfo (options, component) {
  return getComponentOption(options || {}, component, defaultInfo)
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
export function getComponentOption (options, component, result) {
  result = result || {}

  if (component._inactive) {
    return result
  }

  options = options || {}
  const { keyName } = options
  const { $metaInfo, $options, $children } = component

  // only collect option data if it exists
  if ($options[keyName]) {
    // if $metaInfo exists then [keyName] was defined as a function
    // and set to the computed prop $metaInfo in the mixin
    // using the computed prop should be a small performance increase
    // because Vue caches those internally
    const data = $metaInfo || $options[keyName]

    // only merge data with result when its an object
    // eg it could be a function when metaInfo() returns undefined
    // dueo to the or statement above
    if (isObject(data)) {
      result = merge(result, data, options)
    }
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
