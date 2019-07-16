import { metaInfoOptionKeys, metaInfoAttributeKeys } from '../shared/constants'
import { isArray } from '../utils/is-type'
import { includes } from '../utils/array'
import { updateAttribute, updateTag, updateTitle } from './updaters'

function getTag (tags, tag) {
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
export default function updateClientMetaInfo (appId, options = {}, newInfo) {
  const { ssrAttribute, ssrAppId } = options

  // only cache tags for current update
  const tags = {}

  const htmlTag = getTag(tags, 'html')

  // if this is a server render, then dont update
  if (appId === ssrAppId && htmlTag.hasAttribute(ssrAttribute)) {
    // remove the server render attribute so we can update on (next) changes
    htmlTag.removeAttribute(ssrAttribute)
    return false
  }

  // initialize tracked changes
  const addedTags = {}
  const removedTags = {}

  for (const type in newInfo) {
    // ignore these
    if (includes(metaInfoOptionKeys, type)) {
      continue
    }

    if (type === 'title') {
      // update the title
      updateTitle(newInfo.title)
      continue
    }

    if (includes(metaInfoAttributeKeys, type)) {
      const tagName = type.substr(0, 4)
      updateAttribute(options, newInfo[type], getTag(tags, tagName))
      continue
    }

    // tags should always be an array, ignore if it isnt
    if (!isArray(newInfo[type])) {
      continue
    }

    const { oldTags, newTags } = updateTag(
      appId,
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
  }

  return { addedTags, removedTags }
}
