import Vue from 'vue'
import VueMeta from '../src/shared/plugin'
import {
  VUE_META_KEY_NAME,
  VUE_META_ATTRIBUTE,
  VUE_META_SERVER_RENDERED_ATTRIBUTE,
  VUE_META_TAG_LIST_ID_KEY_NAME
} from '../src/shared/constants'

describe('plugin', () => {
  Vue.use(VueMeta, {
    keyName: VUE_META_KEY_NAME,
    attribute: VUE_META_ATTRIBUTE,
    ssrAttribute: VUE_META_SERVER_RENDERED_ATTRIBUTE,
    tagIDKeyName: VUE_META_TAG_LIST_ID_KEY_NAME
  })

  it('adds $meta() to Vue prototype', () => {
    const instance = new Vue()
    expect(instance.$meta).to.be.a('function')
  })

  it('components have _hasMetaInfo set to true', () => {
    const Component = Vue.component('test-component', {
      template: '<div>Test</div>',
      [VUE_META_KEY_NAME]: {
        title: 'helloworld'
      }
    })
    const vm = new Vue(Component).$mount()
    expect(vm._hasMetaInfo).to.equal(true)
  })
})
