import { JSDOM } from 'jsdom'
import { mount, shallowMount, createWrapper, createLocalVue } from '@vue/test-utils'
import { renderToString } from '@vue/server-test-utils'
import { defaultOptions } from '../../src/shared/constants'
import VueMetaPlugin from '../../src'

export {
  mount,
  shallowMount,
  createWrapper,
  renderToString,
  VueMetaPlugin
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
