import updateClientMetaInfo from '../client/updateClientMetaInfo'
import { updateAttribute } from '../client/updaters'
import { metaInfoAttributeKeys } from '../shared/constants'
import { getTag, removeElementsByAppId } from '../utils/elements'

let appsMetaInfo

export function addApp (rootVm, appId, options) {
  return {
    set: metaInfo => setMetaInfo(rootVm, appId, options, metaInfo),
    remove: () => removeMetaInfo(rootVm, appId, options)
  }
}

export function setMetaInfo (rootVm, appId, options, metaInfo) {
  // if a vm exists _and_ its mounted then immediately update
  if (rootVm && rootVm.$el) {
    if (appsMetaInfo && appsMetaInfo[appId]) {
      delete appsMetaInfo[appId]
    }
    return updateClientMetaInfo(appId, options, metaInfo)
  }

  // store for later, the info
  // will be set on the first refresh
  appsMetaInfo = appsMetaInfo || {}
  appsMetaInfo[appId] = metaInfo
}

export function removeMetaInfo (rootVm, appId, options) {
  if (rootVm && rootVm.$el) {
    const tags = {}
    for (const type of metaInfoAttributeKeys) {
      const tagName = type.substr(0, 4)
      updateAttribute(appId, options, type, {}, getTag(tags, tagName))
    }

    return removeElementsByAppId(options, appId)
  }

  if (appsMetaInfo[appId]) {
    delete appsMetaInfo[appId]
    clearAppsMetaInfo()
  }
}

export function getAppsMetaInfo () {
  return appsMetaInfo
}

export function clearAppsMetaInfo (force) {
  if (force || !Object.keys(appsMetaInfo).length) {
    appsMetaInfo = undefined
  }
}
