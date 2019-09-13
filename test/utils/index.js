import { JSDOM } from 'jsdom'
import { mount, shallowMount, createWrapper, createLocalVue } from '@vue/test-utils'
import { render, renderToString } from '@vue/server-test-utils'
import { attributeMap } from '../../src/client/updaters/attribute'
import { defaultOptions } from '../../src/shared/constants'
import VueMetaPlugin from '../../src'

export {
  mount,
  shallowMount,
  createWrapper,
  render,
  renderToString,
  VueMetaPlugin,
  attributeMap
}

export function getVue () {
  return createLocalVue()
}

export function loadVueMetaPlugin (options, localVue = getVue()) {
  localVue.use(VueMetaPlugin, Object.assign({}, defaultOptions, options))

  return localVue
}

export const vmTick = (vm) => {
  return new Promise((resolve) => {
    vm.$nextTick(resolve)
  })
}

export const pTick = () => new Promise(resolve => process.nextTick(resolve))

export function createDOM (html = '<!DOCTYPE html>', options = {}) {
  const dom = new JSDOM(html, options)

  return {
    dom,
    window: dom.window,
    document: dom.window.document
  }
}

// dirty hack to remove data from previous test
// this is ok because this code normally only runs on
// the client and not during ssr
// TODO: findout why jest.resetModules doesnt work for this
export function clearClientAttributeMap () {
  Object.keys(attributeMap).forEach(key => delete attributeMap[key])
}
