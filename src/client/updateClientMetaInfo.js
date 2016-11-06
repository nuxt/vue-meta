import updateTitle from './updaters/updateTitle'
import updateTagAttributes from './updaters/updateTagAttributes'
import updateTags from './updaters/updateTags'
import { SERVER_RENDERED_ATTRIBUTE } from '../shared/constants'

/**
 * Performs client-side updates when new meta info is received
 *
 * @param  {Object} newInfo - the meta info to update to
 */
export default function updateClientMetaInfo (newInfo) {
  const htmlTag = document.getElementsByTagName('html')[0]
  // if this is not a server render, then update
  if (htmlTag.getAttribute(SERVER_RENDERED_ATTRIBUTE) === null) {
    // initialize tracked changes
    const addedTags = {}
    const removedTags = {}

    Object.keys(newInfo).forEach((key) => {
      switch (key) {
        // update the title
        case 'title':
          updateTitle(newInfo.title)
          break
        // update attributes
        case 'htmlAttrs':
        case 'bodyAttrs':
          updateTagAttributes(newInfo[key], key === 'htmlAttrs' ? htmlTag : document.getElementsByTagName('body')[0])
          break
        // ignore these
        case 'titleChunk':
        case 'titleTemplate':
        case 'changed':
          break
        // catch-all update tags
        default:
          const { oldTags, newTags } = updateTags(key, newInfo[key], document.getElementsByTagName('head')[0])
          if (newTags.length) {
            addedTags[key] = newTags
            removedTags[key] = oldTags
          }
      }
    })

    // emit "event" with new info
    if (typeof newInfo.changed === 'function') {
      newInfo.changed(newInfo, addedTags, removedTags)
    }
  } else {
    // remove the server render attribute so we can update on changes
    htmlTag.removeAttribute(SERVER_RENDERED_ATTRIBUTE)
  }
}
