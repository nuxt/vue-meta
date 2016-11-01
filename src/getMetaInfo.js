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
  const info = getComponentOption({ component, option: 'metaInfo', deep: true })

  // if any info options are a function, coerce them to the result of a call
  for (let key in info) {
    if (info.hasOwnProperty(key)) {
      const value = info[key]
      if (typeof value === 'function') {
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

  return info
}
