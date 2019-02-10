import { metaInfoOptionKeys, metaInfoAttributeKeys } from '../shared/constants'
import { updateAttribute, updateTag, updateTitle } from './updaters'

const getTag = (tags, tag) => {
  if (!tags[tag]) {
    tags[tag] = document.getElementsByTagName(tag)[0]
  }

  return tags[tag]
}

/**
 * Performs client-side updates when new meta info is received
 *
 * @param  {Object} newInfo - the meta info to update to
 */
export default function updateClientMetaInfo(options = {}, newInfo) {
  const { ssrAttribute } = options

  // only cache tags for current update
  const tags = {}

  const htmlTag = getTag(tags, 'html')

  // if this is not a server render, then update
  if (htmlTag.getAttribute(ssrAttribute) === null) {
    // initialize tracked changes
    const addedTags = {}
    const removedTags = {}

    Object.keys(newInfo).forEach((type) => {
      // ignore these
      if (metaInfoOptionKeys.includes(type)) {
        return
      }

      if (type === 'title') {
        // update the title
        updateTitle(newInfo.title)
        return
      }

      if (metaInfoAttributeKeys.includes(type)) {
        const tagName = type.substr(0, 4)
        updateAttribute(options, newInfo[type], getTag(tags, tagName))
        return
      }

      const { oldTags, newTags } = updateTag(
        options,
        type,
        newInfo[type],
        getTag(tags, 'head'),
        getTag(tags, 'body')
      )

      if (newTags.length) {
        addedTags[type] = newTags
        removedTags[type] = oldTags
      }
    })

    return { addedTags, removedTags }
  } else {
    // remove the server render attribute so we can update on changes
    htmlTag.removeAttribute(ssrAttribute)
  }

  return false
}
