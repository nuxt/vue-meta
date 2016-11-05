import deepmerge from 'deepmerge'

/**
 * Returns the `opts.option` $option value of the given `opts.component`.
 * If methods are encountered, they will be bound to the component context.
 * If `opts.deep` is true, will recursively merge all child component
 * `opts.option` $option values into the returned result.
 *
 * @param  {Object} opts - options
 * @param  {Object} opts.component - Vue component to fetch option data from
 * @param  {String} opts.option - what option to look for
 * @param  {Boolean} opts.deep - look for data in child components as well?
 * @param  {Function} opts.arrayMerge - how should arrays be merged?
 * @param  {Object} [result={}] - result so far
 * @return {Object} - final aggregated result
 */
export default function getComponentOption (opts, result = {}) {
  const { component, option, deep, arrayMerge } = opts
  const { $options } = component

  // only collect option data if it exists
  if (typeof $options[option] !== 'undefined' && $options[option] !== null) {
    const data = $options[option]

    if (typeof data === 'object') {
      // bind context of option methods (if any) to this component
      Object.keys(data).forEach((key) => {
        const value = data[key]
        data[key] = typeof value === 'function' ? value.bind(component) : value
      })

      // merge with existing options
      result = deepmerge(result, data, {
        clone: true,
        arrayMerge
      })

      // collect & aggregate child options if deep = true
      if (deep && component.$children.length) {
        component.$children.forEach((childComponent) => {
          result = getComponentOption({
            component: childComponent,
            option,
            deep,
            arrayMerge
          }, result)
        })
      }

      return result
    }
    result = data
  }

  return result
}
