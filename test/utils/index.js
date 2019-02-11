import { mount, createLocalVue } from '@vue/test-utils'
import { renderToString } from '@vue/server-test-utils'
import VueMetaPlugin from '../../src'

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
  VueMetaPlugin
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

export function loadVueMetaPlugin(options, localVue = getVue()) {
  localVue.use(VueMetaPlugin, Object.assign({}, defaultOptions, options))

  return localVue
}
