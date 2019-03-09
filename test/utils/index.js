import { mount, createLocalVue } from '@vue/test-utils'
import { renderToString } from '@vue/server-test-utils'
import { defaultOptions } from '../../src/shared/constants'
import VueMetaBrowserPlugin from '../../src/browser'
import VueMetaServerPlugin from '../../src'

export {
  mount,
  renderToString,
  VueMetaBrowserPlugin,
  VueMetaServerPlugin
}

export function getVue() {
  return createLocalVue()
}

export function loadVueMetaPlugin(browser, options, localVue = getVue()) {
  if (browser) {
    localVue.use(VueMetaBrowserPlugin, Object.assign({}, defaultOptions, options))
  } else {
    localVue.use(VueMetaServerPlugin, Object.assign({}, defaultOptions, options))
  }

  return localVue
}

export const vmTick = (vm) => {
  return new Promise((resolve) => {
    vm.$nextTick(resolve)
  })
}
