import updateTitle from './updaters/updateTitle'
import updateTagAttributes from './updaters/updateTagAttributes'
import updateTags from './updaters/updateTags'

export default function _updateClientMetaInfo (options = {}) {
  const { ssrAttribute } = options

  /**
   * Performs client-side updates when new meta info is received
   *
   * @param  {Object} newInfo - the meta info to update to
   */
  return function updateClientMetaInfo (newInfo) {
    const htmlTag = document.getElementsByTagName('html')[0]
    // if this is not a server render, then update
    if (htmlTag.getAttribute(ssrAttribute) === null) {
      // initialize tracked changes
      const addedTags = {}
      const removedTags = {}

      Object.keys(newInfo).forEach((key) => {
        switch (key) {
          // update the title
          case 'title':
            updateTitle(options)(newInfo.title)
            break
          // update attributes
          case 'htmlAttrs':
            updateTagAttributes(options)(newInfo[key], htmlTag)
            break
          case 'bodyAttrs':
            updateTagAttributes(options)(newInfo[key], document.getElementsByTagName('body')[0])
            break
          case 'headAttrs':
            updateTagAttributes(options)(newInfo[key], document.getElementsByTagName('head')[0])
            break
          // ignore these
          case 'titleChunk':
          case 'titleTemplate':
          case 'changed':
          case '__dangerouslyDisableSanitizers':
            break
          // catch-all update tags
          default:
            const headTag = document.getElementsByTagName('head')[0]
            const bodyTag = document.getElementsByTagName('body')[0]
            const { oldTags, newTags } = updateTags(options)(key, newInfo[key], headTag, bodyTag)
            if (newTags.length) {
              addedTags[key] = newTags
              removedTags[key] = oldTags
            }
        }
      })

      // emit "event" with new info
      if (typeof newInfo.changed === 'function') {
        newInfo.changed.call(this, newInfo, addedTags, removedTags)
      }
    } else {
      // remove the server render attribute so we can update on changes
      htmlTag.removeAttribute(ssrAttribute)
    }
  }
}
