import updateTitle from './updaters/updateTitle'
import updateTagAttributes from './updaters/updateTagAttributes'
import updateTags from './updaters/updateTags'
import { SERVER_RENDERED_ATTRIBUTE } from '../shared/constants'

// tags to watch
const tags = [
  'meta',
  'link',
  'base',
  'style',
  'script',
  'noscript'
]

/**
 * Performs client-side updates when new meta info is received
 *
 * @param  {Object} newInfo - the meta info to update to
 */
export default function updateClientMetaInfo (newInfo, $root) {
  const htmlTag = document.getElementsByTagName('html')[0]
  // if this is not a server render, then update
  if (htmlTag.getAttribute(SERVER_RENDERED_ATTRIBUTE) === null) {
    // initialize tracked changes
    const addedTags = {}
    const removedTags = {}

    // update the title
    updateTitle(newInfo.title)

    // update <html> attrs
    updateTagAttributes(newInfo.htmlAttrs, htmlTag)

    // update <body> attrs
    updateTagAttributes(newInfo.bodyAttrs, document.getElementsByTagName('body')[0])

    // update tags
    for (let i = 0, len = tags.length; i < len; i++) {
      const tag = tags[i]
      const { oldTags, newTags } = updateTags(tag, newInfo[tag], document.getElementsByTagName('head')[0])
      if (newTags.length) {
        addedTags[tag] = newTags
        removedTags[tag] = oldTags
      }
    }

    // emit event
    if (typeof newInfo.changed === 'function') {
      newInfo.changed(newInfo, addedTags, removedTags)
    }
  } else {
    htmlTag.removeAttribute(SERVER_RENDERED_ATTRIBUTE)
  }
}
