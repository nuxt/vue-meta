import updateTitleTag from './updateTitleTag'
import updateHtmlTagAttributes from './updateHtmlTagAttributes'
import { SERVER_RENDERED_ATTRIBUTE } from './constants'

/**
 * Performs client-side updates when new meta info is received
 *
 * @param  {Object} newInfo - the meta info to update to
 */
export default function updateClientMetaInfo (newInfo) {
  const htmlTag = document.getElementsByTagName('html')[0]

  // if this is not a server render, then update
  if (htmlTag.getAttribute(SERVER_RENDERED_ATTRIBUTE) === null) {
    if (newInfo.title) {
      updateTitleTag(newInfo.title)
    }

    if (newInfo.htmlAttrs) {
      updateHtmlTagAttributes(newInfo.htmlAttrs)
    }
  } else {
    htmlTag.removeAttribute(SERVER_RENDERED_ATTRIBUTE)
  }
}
