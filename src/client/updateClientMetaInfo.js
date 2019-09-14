import { metaInfoOptionKeys, metaInfoAttributeKeys, tagsSupportingOnload } from '../shared/constants'
import { isArray } from '../utils/is-type'
import { includes } from '../utils/array'
import { getTag, removeAttribute } from '../utils/elements'
import { addCallbacks, addListeners } from './load'
import { updateAttribute, updateTag, updateTitle } from './updaters'

/**
 * Performs client-side updates when new meta info is received
 *
 * @param  {Object} newInfo - the meta info to update to
 */
export default function updateClientMetaInfo (appId, options, newInfo) {
  options = options || {}
  const { ssrAttribute, ssrAppId } = options

  // only cache tags for current update
  const tags = {}

  const htmlTag = getTag(tags, 'html')

  // if this is a server render, then dont update
  if (appId === ssrAppId && htmlTag.hasAttribute(ssrAttribute)) {
    // remove the server render attribute so we can update on (next) changes
    removeAttribute(htmlTag, ssrAttribute)

    // add load callbacks if the
    let addLoadListeners = false
    tagsSupportingOnload.forEach((type) => {
      if (newInfo[type] && addCallbacks(options, type, newInfo[type])) {
        addLoadListeners = true
      }
    })

    if (addLoadListeners) {
      addListeners()
    }

    return false
  }

  // initialize tracked changes
  const tagsAdded = {}
  const tagsRemoved = {}

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
      updateAttribute(appId, options, type, newInfo[type], getTag(tags, tagName))
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
      tagsAdded[type] = newTags
      tagsRemoved[type] = oldTags
    }
  }

  return { tagsAdded, tagsRemoved }
}
