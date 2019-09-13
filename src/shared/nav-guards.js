import { isFunction } from '../utils/is-type'
import { rootConfigKey } from './constants'

export function addNavGuards (rootVm) {
  // return when nav guards already added or no router exists
  if (rootVm[rootConfigKey].navGuards || !rootVm.$router) {
    /* istanbul ignore next */
    return
  }

  rootVm[rootConfigKey].navGuards = true

  const $router = rootVm.$router
  const $meta = rootVm.$meta()

  $router.beforeEach((to, from, next) => {
    $meta.pause()
    next()
  })

  $router.afterEach(() => {
    const { metaInfo } = $meta.resume()
    if (metaInfo && metaInfo.afterNavigation && isFunction(metaInfo.afterNavigation)) {
      metaInfo.afterNavigation(metaInfo)
    }
  })
}
