import { serverSequences } from '../shared/escaping'
import { rootConfigKey } from '../shared/constants'
import { showWarningNotSupported } from '../shared/log'
import { getComponentMetaInfo } from '../shared/getComponentOption'
import { getAppsMetaInfo, clearAppsMetaInfo } from '../shared/additional-app'
import getMetaInfo from '../shared/getMetaInfo'
import generateServerInjector from './generateServerInjector'

/**
 * Converts the state of the meta info object such that each item
 * can be compiled to a tag string on the server
 *
 * @vm {Object} - Vue instance - ideally the root component
 * @return {Object} - server meta info with `toString` methods
 */
export default function inject (rootVm, options, injectOptions) {
  // make sure vue-meta was initiated
  if (!rootVm[rootConfigKey]) {
    showWarningNotSupported()
    return {}
  }

  // collect & aggregate all metaInfo $options
  const rawInfo = getComponentMetaInfo(options, rootVm)

  const metaInfo = getMetaInfo(options, rawInfo, serverSequences, rootVm)

  // generate server injector
  const serverInjector = generateServerInjector(options, metaInfo, injectOptions)

  // add meta info from additional apps
  const appsMetaInfo = getAppsMetaInfo()
  if (appsMetaInfo) {
    for (const additionalAppId in appsMetaInfo) {
      serverInjector.addInfo(additionalAppId, appsMetaInfo[additionalAppId])
      delete appsMetaInfo[additionalAppId]
    }
    clearAppsMetaInfo(true)
  }

  return serverInjector.injectors
}
