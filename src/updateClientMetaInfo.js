import updateTitleTag from './updateTitleTag'
import updateHtmlTagAttributes from './updateHtmlTagAttributes'

/**
 * Performs client-side updates when new meta info is received
 *
 * @param  {Object} newInfo - the meta info to update to
 */
export default function updateClientMetaInfo (newInfo) {
  if (newInfo.title) {
    updateTitleTag(newInfo.title)
  }
  if (newInfo.htmlAttrs) {
    updateHtmlTagAttributes(newInfo.htmlAttrs)
  }
}
