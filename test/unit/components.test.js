import { getComponentMetaInfo } from '../../src/shared/getComponentOption'
import _getMetaInfo from '../../src/shared/getMetaInfo'
import { mount, createWrapper, loadVueMetaPlugin, vmTick } from '../utils'
import { defaultOptions } from '../../src/shared/constants'

import GoodbyeWorld from '../components/goodbye-world.vue'
import HelloWorld from '../components/hello-world.vue'
import KeepAlive from '../components/keep-alive.vue'
import Changed from '../components/changed.vue'

const getMetaInfo = component => _getMetaInfo(defaultOptions, getComponentMetaInfo(defaultOptions, component))

jest.mock('../../src/utils/window', () => ({
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
    expect(metaInfo.title).toEqual(undefined)
  })

  test('meta-info can be rendered with inject', () => {
    const wrapper = mount(HelloWorld, { localVue: Vue })

    const metaInfo = wrapper.vm.$meta().inject()
    expect(metaInfo.title.text()).toEqual('<title>Hello World</title>')
  })

  test('doesnt update when ssr attribute is set', () => {
    html.setAttribute(defaultOptions.ssrAttribute, 'true')

    const el = document.createElement('div')
    el.setAttribute('id', 'app')
    el.setAttribute('data-server-rendered', true)
    document.body.appendChild(el)

    const Component = Vue.extend({
      metaInfo: { title: 'Test' },
      render (h) {
        return h('div', null, 'Test')
      }
    })

    const vm = new Component().$mount(el)
    const wrapper = createWrapper(vm, { attachToDocument: true })

    const { tags } = wrapper.vm.$meta().refresh()
    expect(tags).toBe(false)

    wrapper.destroy()
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

  test('afterNavigation function is called with refreshOnce: true', async () => {
    const Vue = loadVueMetaPlugin({ refreshOnceOnNavigation: true })
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
          beforeEach (fn) {
            guards.before = fn
          },
          afterEach (fn) {
            guards.after = fn
          }
        }
      }
    })

    await vmTick(wrapper.vm)

    expect(guards.before).toBeDefined()
    expect(guards.after).toBeDefined()

    guards.before(null, null, () => {})
    expect(wrapper.vm.$root._vueMeta.paused).toBe(true)

    guards.after()
    expect(afterNavigation).toHaveBeenCalled()
  })

  test('afterNavigation function is called with refreshOnce: false', async () => {
    const Vue = loadVueMetaPlugin({ refreshOnceOnNavigation: false })
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
          beforeEach (fn) {
            guards.before = fn
          },
          afterEach (fn) {
            guards.after = fn
          }
        }
      }
    })

    await vmTick(wrapper.vm)

    expect(guards.before).toBeDefined()
    expect(guards.after).toBeDefined()

    guards.before(null, null, () => {})
    expect(wrapper.vm.$root._vueMeta.paused).toBe(true)

    guards.after()
    expect(afterNavigation).toHaveBeenCalled()
  })

  test('changes before hydration initialization trigger an update', async () => {
    html.setAttribute(defaultOptions.ssrAttribute, 'true')

    const el = document.createElement('div')
    el.setAttribute('id', 'app')
    el.setAttribute('data-server-rendered', true)
    document.body.appendChild(el)

    // this component uses a computed prop to simulate a non-synchronous
    // metaInfo update like you would have with a Vuex mutation
    const Component = Vue.extend({
      data () {
        return {
          hiddenTheme: 'light'
        }
      },
      computed: {
        theme () {
          return this.hiddenTheme
        }
      },
      beforeMount () {
        this.hiddenTheme = 'dark'
      },
      render: h => h('div'),
      metaInfo () {
        return {
          htmlAttrs: {
            theme: this.theme
          }
        }
      }
    })

    const vm = new Component().$mount(el)
    const wrapper = createWrapper(vm, { attachToDocument: true })
    expect(html.getAttribute('theme')).not.toBe('dark')

    await vmTick(wrapper.vm)
    jest.runAllTimers()

    expect(html.getAttribute('theme')).toBe('dark')
    html.removeAttribute('theme')

    wrapper.destroy()
  })

  test('changes during hydration initialization trigger an update', async () => {
    html.setAttribute(defaultOptions.ssrAttribute, 'true')

    const el = document.createElement('div')
    el.setAttribute('id', 'app')
    el.setAttribute('data-server-rendered', true)
    document.body.appendChild(el)

    const Component = Vue.extend({
      data () {
        return {
          hiddenTheme: 'light'
        }
      },
      computed: {
        theme () {
          return this.hiddenTheme
        }
      },
      mounted () {
        this.hiddenTheme = 'dark'
      },
      render: h => h('div'),
      metaInfo () {
        return {
          htmlAttrs: {
            theme: this.theme
          }
        }
      }
    })

    const vm = new Component().$mount(el)
    const wrapper = createWrapper(vm, { attachToDocument: true })
    expect(html.getAttribute('theme')).not.toBe('dark')

    await vmTick(wrapper.vm)
    jest.runAllTimers()

    expect(html.getAttribute('theme')).toBe('dark')
    html.removeAttribute('theme')

    wrapper.destroy()
  })
})
