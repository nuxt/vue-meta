import { mount, createLocalVue } from '@vue/test-utils'
import { renderToString } from '@vue/server-test-utils'
import VueMetaPlugin from '../../src'

import {
  VUE_META_ATTRIBUTE,
  VUE_META_CONTENT_KEY,
  VUE_META_KEY_NAME,
  VUE_META_SERVER_RENDERED_ATTRIBUTE,
  VUE_META_TAG_LIST_ID_KEY_NAME,
  VUE_META_TEMPLATE_KEY_NAME
} from '../../src/shared/constants'

export {
  mount,
  renderToString,
  VueMetaPlugin
}

export const defaultOptions = {
  keyName: VUE_META_KEY_NAME,
  attribute: VUE_META_ATTRIBUTE,
  ssrAttribute: VUE_META_SERVER_RENDERED_ATTRIBUTE,
  metaTemplateKeyName: VUE_META_TEMPLATE_KEY_NAME,
  contentKeyName: VUE_META_CONTENT_KEY,
  tagIDKeyName: VUE_META_TAG_LIST_ID_KEY_NAME
}

export function getVue() {
  return createLocalVue()
}

export function loadVueMetaPlugin(options, localVue = getVue()) {
  localVue.use(VueMetaPlugin, Object.assign({}, defaultOptions, options))

  return localVue
}
