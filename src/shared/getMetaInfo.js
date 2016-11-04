import getComponentOption from './getComponentOption'

/**
 * Returns the correct meta info for the given component
 * (child components will overwrite parent meta info)
 *
 * @param  {Object} component - the Vue instance to get meta info from
 * @return {Object} - returned meta info
 */
export default function getMetaInfo (component) {
  // collect & aggregate all metaInfo $options
  const info = getComponentOption({
    component,
    option: 'metaInfo',
    deep: true,
    // In order to prevent certain tags from being overwritten,
    // (like <meta name="description" ...> being overwritten by
    // <meta name="keywords" ...>), we need to specify a different
    // array merge strategy. This strategy exploits a trick
    // with associative arrays in JS using O(1) lookup

    /* eslint-disable no-labels */
    arrayMerge (oldTags, newTags) {
      const updatedTags = []
      for (let oldTagIndex in oldTags) {
        const oldTag = oldTags[oldTagIndex]
        let sharedAttributes = false
        ifTagsHaveEqualSharedAttributeValues: for (let newTagIndex in newTags) {
          const newTag = newTags[newTagIndex]
          for (let attribute in newTag) {
            if (newTag.hasOwnProperty(attribute) && oldTag.hasOwnProperty(attribute)) {
              if (oldTag[attribute] === newTag[attribute]) {
                sharedAttributes = true
                break ifTagsHaveEqualSharedAttributeValues
              }
            }
          }
        }
        if (!sharedAttributes) {
          updatedTags.push(oldTag)
        }
      }
      return updatedTags.concat(newTags)
    }
    /* eslint-enable no-labels */
  })

  // if any info options are a function, coerce them to the result of a call
  for (let key in info) {
    if (info.hasOwnProperty(key)) {
      const value = info[key]
      if (typeof value === 'function' && key !== 'changed') {
        info[key] = value()
      }
    }
  }

  // backup the title chunk
  if (info.title) {
    info.titleChunk = info.title
  }

  // replace title with populated template
  if (info.titleTemplate && info.titleChunk) {
    info.title = info.titleTemplate.replace(/%s/g, info.titleChunk)
  }

  // convert base tag to an array
  if (info.base) {
    info.base = Object.keys(info.base).length ? [info.base] : []
  }

  return info
}
