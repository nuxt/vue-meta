import { clientSequences } from '../shared/escaping'
import { rootConfigKey } from '../shared/constants'
import { showWarningNotSupported } from '../shared/log'
import { getComponentMetaInfo } from '../shared/getComponentOption'
import { getAppsMetaInfo, clearAppsMetaInfo } from '../shared/additional-app'
import getMetaInfo from '../shared/getMetaInfo'
import { isFunction } from '../utils/is-type'
import updateClientMetaInfo from './updateClientMetaInfo'

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
export default function refresh (rootVm, options) {
  options = options || {}

  // make sure vue-meta was initiated
  if (!rootVm[rootConfigKey]) {
    showWarningNotSupported()
    return {}
  }

  // collect & aggregate all metaInfo $options
  const rawInfo = getComponentMetaInfo(options, rootVm)

  const metaInfo = getMetaInfo(options, rawInfo, clientSequences, rootVm)

  const { appId } = rootVm[rootConfigKey]
  let tags = updateClientMetaInfo(appId, options, metaInfo)

  // emit "event" with new info
  if (tags && isFunction(metaInfo.changed)) {
    metaInfo.changed(metaInfo, tags.tagsAdded, tags.tagsRemoved)

    tags = {
      addedTags: tags.tagsAdded,
      removedTags: tags.tagsRemoved
    }
  }

  const appsMetaInfo = getAppsMetaInfo()
  if (appsMetaInfo) {
    for (const additionalAppId in appsMetaInfo) {
      updateClientMetaInfo(additionalAppId, options, appsMetaInfo[additionalAppId])
      delete appsMetaInfo[additionalAppId]
    }
    clearAppsMetaInfo(true)
  }

  return {
    vm: rootVm,
    metaInfo: metaInfo, // eslint-disable-line object-shorthand
    tags
  }
}
