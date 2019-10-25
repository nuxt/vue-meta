import { isFunction } from '../utils/is-type'
import { rootConfigKey } from './constants'
import { pause, resume } from './pausing'

export function addNavGuards (rootVm) {
  const router = rootVm.$router

  // return when nav guards already added or no router exists
  if (rootVm[rootConfigKey].navGuards || !router) {
    /* istanbul ignore next */
    return
  }

  rootVm[rootConfigKey].navGuards = true

  router.beforeEach((to, from, next) => {
    pause(rootVm)
    next()
  })

  router.afterEach(() => {
    rootVm.$nextTick(function () {
      const { metaInfo } = resume(rootVm)

      if (metaInfo && isFunction(metaInfo.afterNavigation)) {
        metaInfo.afterNavigation(metaInfo)
      }
    })
  })
}
