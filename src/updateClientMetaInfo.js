import updateTitleTag from './updateTitleTag'
import updateHtmlTagAttributes from './updateHtmlTagAttributes'
import { SERVER_RENDERED_ATTRIBUTE } from './constants'

if (typeof window !== 'undefined' && window !== null) {
  var htmlTag = document.getElementsByTagName('html')[0]
}

/**
 * Performs client-side updates when new meta info is received
 *
 * @param  {Object} newInfo - the meta info to update to
 */
export default function updateClientMetaInfo (newInfo, $root) {
  // if this is not a server render, then update
  if (htmlTag.getAttribute(SERVER_RENDERED_ATTRIBUTE) === null) {
    if (newInfo.title) {
      updateTitleTag(newInfo.title)
    }

    if (newInfo.htmlAttrs) {
      updateHtmlTagAttributes(newInfo.htmlAttrs, htmlTag)
    }
  } else {
    htmlTag.removeAttribute(SERVER_RENDERED_ATTRIBUTE)
  }

  // HACK: since we're performing DOM side effects, we can't rely on
  // Vue.nextTick in our tests. This event helps keep the test suite
  // free of setTimeout clutter
  $root.$emit('vue-meta-update')
}
