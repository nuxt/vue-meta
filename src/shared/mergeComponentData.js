/**
 * Recursively shallow-merges component object with it's children component objects.
 * This function is responsible for obtaining the `this` context of metaInfo props when
 * declared in function form.
 *
 * @param  {Object} component - the component object
 * @return {Object} - the merged data
 */
export default function mergeComponentData (component) {
  if (component.$children.length) {
    return component.$children.reduce((data, child) => {
      return Object.assign({}, data, mergeComponentData(child))
    }, component)
  }
  return component
}
