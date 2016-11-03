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

// hoisted vars but only in the browser
if (typeof window !== 'undefined' && window !== null) {
  var htmlTag = document.getElementsByTagName('html')[0]
  var bodyTag = document.getElementsByTagName('body')[0]
  var headTag = document.getElementsByTagName('head')[0]
}

/**
 * Performs client-side updates when new meta info is received
 *
 * @param  {Object} newInfo - the meta info to update to
 */
export default function updateClientMetaInfo (newInfo, $root) {
  // if this is not a server render, then update
  if (htmlTag.getAttribute(SERVER_RENDERED_ATTRIBUTE) === null) {
    // update the title
    updateTitle(newInfo.title)

    // update <html> attrs
    updateTagAttributes(newInfo.htmlAttrs, htmlTag)

    // update <body> attrs
    updateTagAttributes(newInfo.bodyAttrs, bodyTag)

    // update tags
    for (let i = 0, len = tags.length; i < len; i++) {
      const tag = tags[i]
      updateTags(tag, newInfo[tag], headTag)
    }
  } else {
    htmlTag.removeAttribute(SERVER_RENDERED_ATTRIBUTE)
  }

  // HACK: since we're performing DOM side effects, we can't rely on
  // Vue.nextTick in our tests. This event helps keep the test suite
  // free of setTimeout clutter
  $root.$emit('vue-meta-update')
}
