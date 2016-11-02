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
 * @param  {Object} [result={}] - result so far
 * @return {Object} - final aggregated result
 */
export default function getComponentOption (opts, result = {}) {
  const { component, option, deep } = opts
  const { $options } = component

  // only collect option data if it exists
  if ($options[option]) {
    const data = $options[option]

    // TODO: check data is plain object, throw if not

    // bind context of option methods (if any) to this component
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key]
        if (typeof value === 'function') {
          data[key] = value.bind(component)
        }
      }
    }

    // merge with existing options
    result = deepmerge(result, data)
  }

  // collect & aggregate child options if deep = true
  if (deep) {
    const { $children } = component
    for (let i = 0, len = $children.length; i < len; i++) {
      const component = $children[i]
      result = getComponentOption({ option, deep, component }, result)
    }
  }

  return result
}
