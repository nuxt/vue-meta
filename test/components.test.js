import _getMetaInfo from '../src/shared/getMetaInfo'
import { mount, defaultOptions, loadVueMetaPlugin } from './utils'

import GoodbyeWorld from './fixtures/goodbye-world.vue'
import HelloWorld from './fixtures/hello-world.vue'
import KeepAlive from './fixtures/keep-alive.vue'
import Changed from './fixtures/changed.vue'

const getMetaInfo = component => _getMetaInfo(defaultOptions, component)

describe('client', () => {
  let Vue

  beforeAll(() => (Vue = loadVueMetaPlugin()))

  test('meta-info refreshed on component\'s data change', () => {
    const wrapper = mount(HelloWorld, { localVue: Vue })

    let metaInfo = getMetaInfo(wrapper.vm)
    expect(metaInfo.title).toEqual('Hello World')
    wrapper.setData({ title: 'Goodbye World' })

    metaInfo = getMetaInfo(wrapper.vm)
    expect(metaInfo.title).toEqual('Goodbye World')
  })

  test('child meta-info removed when child is toggled', () => {
    const wrapper = mount(GoodbyeWorld, { localVue: Vue })

    let metaInfo = getMetaInfo(wrapper.vm)
    expect(metaInfo.title).toEqual('Hello World')

    wrapper.setData({ childVisible: false })

    metaInfo = getMetaInfo(wrapper.vm)
    expect(metaInfo.title).toEqual('Goodbye World')

    wrapper.setData({ childVisible: true })

    metaInfo = getMetaInfo(wrapper.vm)
    expect(metaInfo.title).toEqual('Hello World')
  })

  test('child meta-info removed when keep-alive child is toggled', () => {
    const wrapper = mount(KeepAlive, { localVue: Vue })

    let metaInfo = getMetaInfo(wrapper.vm)
    expect(metaInfo.title).toEqual('Hello World')

    wrapper.setData({ childVisible: false })

    metaInfo = getMetaInfo(wrapper.vm)
    expect(metaInfo.title).toEqual('Alive World')

    wrapper.setData({ childVisible: true })

    metaInfo = getMetaInfo(wrapper.vm)
    expect(metaInfo.title).toEqual('Hello World')
  })

  test('meta-info is removed when destroyed', () => {
    const parentComponent = new Vue({ render: h => h('div') })
    const wrapper = mount(HelloWorld, { localVue: Vue, parentComponent })

    let metaInfo = getMetaInfo(wrapper.vm.$parent)
    expect(metaInfo.title).toEqual('Hello World')
    wrapper.destroy()

    jest.runAllTimers()
    metaInfo = getMetaInfo(wrapper.vm.$parent)
    expect(metaInfo.title).toEqual('')
  })

  test('meta-info can be rendered with inject', () => {
    const wrapper = mount(HelloWorld, { localVue: Vue })

    const metaInfo = wrapper.vm.$meta().inject()
    expect(metaInfo.title.text()).toEqual('<title data-vue-meta="true">Hello World</title>')
  })

  test('changed function is called', () => {
    const parentComponent = new Vue({ render: h => h('div') })
    const wrapper = mount(Changed, { localVue: Vue, parentComponent })

    let context
    const changed = jest.fn(function () {
      context = this
    })
    wrapper.setData({ changed })
    wrapper.setData({ childVisible: true })

    wrapper.vm.$parent.$meta().refresh()
    expect(changed).toHaveBeenCalledTimes(1)
    // TODO: this isnt what the docs say
    expect(context._uid).not.toBe(wrapper.vm._uid)
  })
})
