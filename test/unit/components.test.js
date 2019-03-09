import _getMetaInfo from '../../src/shared/getMetaInfo'
import { mount, loadVueMetaPlugin, vmTick } from '../utils'
import { defaultOptions } from '../../src/shared/constants'

import GoodbyeWorld from '../components/goodbye-world.vue'
import HelloWorld from '../components/hello-world.vue'
import KeepAlive from '../components/keep-alive.vue'
import Changed from '../components/changed.vue'

const getMetaInfo = component => _getMetaInfo(defaultOptions, component)

jest.mock('../../src/shared/window', () => ({
  hasGlobalWindow: false
}))

describe('client', () => {
  let Vue
  let html

  beforeAll(() => {
    Vue = loadVueMetaPlugin()

    // force using timers, jest cant mock rAF
    delete window.requestAnimationFrame
    delete window.cancelAnimationFrame

    html = document.createElement('html')
    document._getElementsByTagName = document.getElementsByTagName
    jest.spyOn(document, 'getElementsByTagName').mockImplementation((tag) => {
      if (tag === 'html') {
        return [html]
      }

      return document._getElementsByTagName(tag)
    })
  })

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

  test('doesnt update when ssr attribute is set', () => {
    html.setAttribute(defaultOptions.ssrAttribute, 'true')
    const wrapper = mount(HelloWorld, { localVue: Vue })

    const { tags } = wrapper.vm.$meta().refresh()
    expect(tags).toBe(false)
  })

  test('changed function is called', async () => {
    let context
    const changed = jest.fn(function () {
      context = this
    })

    const wrapper = mount(Changed, { localVue: Vue, propsData: { changed } })

    await vmTick(wrapper.vm)
    expect(wrapper.vm.$root._vueMeta.initialized).toBe(true)
    // TODO: does changed need to run on initialization?
    expect(changed).toHaveBeenCalledTimes(1)

    wrapper.setData({ childVisible: true })
    jest.runAllTimers()

    expect(changed).toHaveBeenCalledTimes(2)
    expect(context._uid).toBe(wrapper.vm._uid)
  })

  test('afterNavigation function is called', () => {
    const Vue = loadVueMetaPlugin(false, { refreshOnceOnNavigation: true })
    const afterNavigation = jest.fn()
    const component = Vue.component('nav-component', {
      render: h => h('div'),
      metaInfo: { afterNavigation }
    })

    const guards = {}
    const wrapper = mount(component, {
      localVue: Vue,
      mocks: {
        $router: {
          beforeEach(fn) {
            guards.before = fn
          },
          afterEach(fn) {
            guards.after = fn
          }
        }
      }
    })

    expect(guards.before).toBeDefined()
    expect(guards.after).toBeDefined()

    guards.before(null, null, () => {})
    expect(wrapper.vm.$root._vueMeta.paused).toBe(true)

    guards.after()
    expect(afterNavigation).toHaveBeenCalled()
  })
})
