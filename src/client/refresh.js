import getMetaInfo from '../shared/getMetaInfo'
import updateClientMetaInfo from './updateClientMetaInfo'

export default function _refresh(options = {}) {
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
    const metaInfo = getMetaInfo(options, this.$root)

    const tags = updateClientMetaInfo(options, metaInfo)

    // emit "event" with new info
    if (tags && typeof metaInfo.changed === 'function') {
      metaInfo.changed.call(this, metaInfo, tags.addedTags, tags.removedTags)
    }

    return metaInfo
  }
}
