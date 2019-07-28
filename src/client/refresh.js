import { clientSequences } from '../shared/escaping'
import { getComponentMetaInfo } from '../shared/getComponentOption'
import getMetaInfo from '../shared/getMetaInfo'
import { isFunction } from '../utils/is-type'
import updateClientMetaInfo from './updateClientMetaInfo'

export default function _refresh (options = {}) {
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
  return function refresh () {
    // collect & aggregate all metaInfo $options
    const rawInfo = getComponentMetaInfo(options, this.$root)

    const metaInfo = getMetaInfo(options, rawInfo, clientSequences, this.$root)

    const appId = this.$root._vueMeta.appId
    const tags = updateClientMetaInfo(appId, options, metaInfo)

    // emit "event" with new info
    if (tags && isFunction(metaInfo.changed)) {
      metaInfo.changed(metaInfo, tags.addedTags, tags.removedTags)
    }

    return { vm: this, metaInfo, tags }
  }
}
