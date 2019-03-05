import { mount, createLocalVue } from '@vue/test-utils'
import { renderToString } from '@vue/server-test-utils'
import * as VueMetaBrowserPlugin from '../../src/browser'
import * as VueMetaServerPlugin from '../../src'

import {
  keyName,
  attribute,
  ssrAttribute,
  tagIDKeyName,
  metaTemplateKeyName,
  contentKeyName
} from '../../src/shared/constants'

export {
  mount,
  renderToString,
  VueMetaBrowserPlugin,
  VueMetaServerPlugin
}

export const defaultOptions = {
  keyName,
  attribute,
  ssrAttribute,
  tagIDKeyName,
  metaTemplateKeyName,
  contentKeyName
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
