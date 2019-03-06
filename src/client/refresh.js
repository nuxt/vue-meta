import getMetaInfo from '../shared/getMetaInfo'
import { isFunction } from '../shared/typeof'
import updateClientMetaInfo from './updateClientMetaInfo'

export default function _refresh(options = {}) {
  const escapeSequences = [
    [/&/g, '\u0026'],
    [/</g, '\u003c'],
    [/>/g, '\u003e'],
    [/"/g, '\u0022'],
    [/'/g, '\u0027']
  ]

  /**
   * When called, will update the current meta info with new meta info.
   * Useful when updating meta info as the result of an asynchronous
   * action that resolves after the initial render takes place.
   *
   * Credit to [Sébastien Chopin](https://github.com/Atinux) for the suggestion
   * to implement this method.
   *
   * @return {Object} - new meta info
   */
  return function refresh() {
    const metaInfo = getMetaInfo(options, this.$root, escapeSequences)

    const tags = updateClientMetaInfo(options, metaInfo)
    // emit "event" with new info
    if (tags && isFunction(metaInfo.changed)) {
      metaInfo.changed.call(this, metaInfo, tags.addedTags, tags.removedTags)
    }

    return { vm: this, metaInfo, tags }
  }
}
