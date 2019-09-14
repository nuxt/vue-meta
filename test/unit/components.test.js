import { getComponentMetaInfo } from '../../src/shared/getComponentOption'
import _getMetaInfo from '../../src/shared/getMetaInfo'
import { mount, createWrapper, loadVueMetaPlugin, vmTick, clearClientAttributeMap } from '../utils'
import { defaultOptions } from '../../src/shared/constants'

import GoodbyeWorld from '../components/goodbye-world.vue'
import HelloWorld from '../components/hello-world.vue'
import KeepAlive from '../components/keep-alive.vue'
import Changed from '../components/changed.vue'

const getMetaInfo = component => _getMetaInfo(defaultOptions, getComponentMetaInfo(defaultOptions, component))

jest.mock('../../src/utils/window', () => ({
  hasGlobalWindow: false
}))

describe('components', () => {
  let Vue
  let elements

  beforeAll(() => {
    Vue = loadVueMetaPlugin()

    // force using timers, jest cant mock rAF
    delete window.requestAnimationFrame
    delete window.cancelAnimationFrame

    elements = {
      html: document.createElement('html'),
      head: document.createElement('head'),
      body: document.createElement('body')
    }

    elements.html.appendChild(elements.head)
    elements.html.appendChild(elements.body)

    document._getElementsByTagName = document.getElementsByTagName
    jest.spyOn(document, 'getElementsByTagName').mockImplementation((tag) => {
      if (elements[tag]) {
        return [elements[tag]]
      }

      return document._getElementsByTagName(tag)
    })
    jest.spyOn(document, 'querySelectorAll').mockImplementation((query) => {
      return elements.html.querySelectorAll(query)
    })
  })

  afterEach(() => {
    elements.html.getAttributeNames().forEach(name => elements.html.removeAttribute(name))
    elements.head.childNodes.forEach(child => child.remove())
    elements.head.getAttributeNames().forEach(name => elements.head.removeAttribute(name))
    elements.body.childNodes.forEach(child => child.remove())
    elements.body.getAttributeNames().forEach(name => elements.body.removeAttribute(name))

    clearClientAttributeMap()
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

  test('warns when component doesnt has metaInfo', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const metaInfo = HelloWorld.metaInfo
    delete HelloWorld.metaInfo

    const wrapper = mount(HelloWorld, { localVue: Vue })
    wrapper.vm.$meta().inject()

    HelloWorld.metaInfo = metaInfo

    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledWith('This vue app/component has no vue-meta configuration')

    warn.mockRestore()
  })

  test('meta-info can be rendered with inject', () => {
    const wrapper = mount(HelloWorld, { localVue: Vue })

    const metaInfo = wrapper.vm.$meta().inject()
    expect(metaInfo.title.text()).toEqual('<title>Hello World</title>')
  })

  test('inject also renders additional app info', () => {
    HelloWorld.created = function () {
      const { set } = this.$meta().addApp('inject-test-app')
      set({
        htmlAttrs: { lang: 'nl' },
        meta: [{ name: 'description', content: 'test-description' }]
      })
    }

    const wrapper = mount(HelloWorld, { localVue: Vue })

    const metaInfo = wrapper.vm.$meta().inject()
    expect(metaInfo.title.text()).toEqual('<title>Hello World</title>')

    expect(metaInfo.htmlAttrs.text()).toEqual('lang="en nl" data-vue-meta="%7B%22lang%22:%7B%22ssr%22:%22en%22,%22inject-test-app%22:%22nl%22%7D%7D"')
    expect(metaInfo.meta.text()).toEqual('<meta data-vue-meta="ssr" charset="utf-8"><meta data-vue-meta="inject-test-app" name="description" content="test-description">')

    delete HelloWorld.created
  })

  test('attributes with special meaning or functioning correct with inject', () => {
    HelloWorld.created = function () {
      const { set } = this.$meta().addApp('inject-test-app')
      set({
        meta: [{ skip: true, name: 'description', content: 'test-description' }],
        script: [{
          once: true,
          callback: true,
          async: false,
          json: {
            a: 1
          }
        }]
      })
    }

    const wrapper = mount(HelloWorld, { localVue: Vue })

    const metaInfo = wrapper.vm.$meta().inject()

    expect(metaInfo.meta.text()).toEqual('<meta data-vue-meta="ssr" charset="utf-8">')
    expect(metaInfo.script.text()).toEqual('<script onload="this.__vm_l=1">{"a":1}</script>')

    delete HelloWorld.created
  })

  test('doesnt update when ssr attribute is set', () => {
    elements.html.setAttribute(defaultOptions.ssrAttribute, 'true')

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
    expect(wrapper.vm.$root._vueMeta.pausing).toBe(true)

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
    expect(wrapper.vm.$root._vueMeta.pausing).toBe(true)

    guards.after()
    expect(afterNavigation).toHaveBeenCalled()
  })

  test('changes before hydration initialization trigger an update', async () => {
    const { html } = elements
    html.setAttribute(defaultOptions.ssrAttribute, 'true')

    const el = document.createElement('div')
    el.setAttribute('id', 'app')
    el.setAttribute('data-server-rendered', true)
    document.body.appendChild(el)

    // this component uses a computed prop to simulate a non-synchronous
    // metaInfo update like you would have with a Vuex mutation
    const Component = Vue.extend({
      metaInfo () {
        return {
          htmlAttrs: {
            theme: this.theme
          }
        }
      },
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
      render: h => h('div')
    })

    const vm = new Component().$mount(el)
    const wrapper = createWrapper(vm, { attachToDocument: true })
    expect(html.getAttribute('theme')).not.toBe('dark')

    await vmTick(wrapper.vm)
    jest.runAllTimers()

    expect(html.getAttribute('theme')).toBe('dark')
    wrapper.destroy()
  })

  test('changes during hydration initialization trigger an update', async () => {
    const { html } = elements
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
    wrapper.destroy()
  })

  test('can add/remove meta info from additional app ', () => {
    const { html } = elements
    let app

    HelloWorld.created = function () {
      // make sure that app's which set data but are removed before mounting
      // are really removed
      const { set, remove } = this.$meta().addApp('my-bogus-app')
      set({
        meta: [{ name: 'og:description', content: 'test-description' }]
      })
      remove()

      app = this.$meta().addApp('my-test-app')
      app.set({
        htmlAttrs: { lang: 'nl' },
        meta: [{ name: 'description', content: 'test-description' }],
        script: [{ innerHTML: 'var test = true;' }]
      })
    }

    const wrapper = mount(HelloWorld, {
      localVue: Vue
    })

    wrapper.vm.$meta().refresh()

    expect(html.getAttribute('lang')).toEqual('en nl')
    expect(Array.from(html.querySelectorAll('meta')).length).toBe(2)
    expect(Array.from(html.querySelectorAll('script')).length).toBe(1)
    expect(Array.from(html.querySelectorAll('[data-vue-meta="my-test-app"]')).length).toBe(2)

    app.remove()

    // add another app to make sure on client data is immediately added
    const anotherApp = wrapper.vm.$meta().addApp('another-test-app')
    anotherApp.set({
      meta: [{ name: 'og:description', content: 'test-description' }]
    })

    expect(html.getAttribute('lang')).toEqual('en')
    expect(Array.from(html.querySelectorAll('meta')).length).toBe(2)
    expect(Array.from(html.querySelectorAll('script')).length).toBe(0)
    expect(Array.from(html.querySelectorAll('[data-vue-meta="my-test-app"]')).length).toBe(0)
    expect(Array.from(html.querySelectorAll('[data-vue-meta="another-test-app"]')).length).toBe(1)

    wrapper.destroy()
    delete HelloWorld.created
  })

  test('retrieves ssr app config from attribute', () => {
    const { html, body } = elements
    html.setAttribute(defaultOptions.ssrAttribute, 'true')

    body.setAttribute('foo', 'bar')
    body.setAttribute('data-vue-meta', '%7B%22foo%22:%7B%22ssr%22:%22bar%22%7D%7D')

    const el = document.createElement('div')
    el.setAttribute('id', 'app')
    el.setAttribute('data-server-rendered', true)
    document.body.appendChild(el)

    const Component = Vue.extend({
      metaInfo: {
        title: 'Test',
        bodyAttrs: {
          foo: 'bar'
        }
      },
      render: h => h('div', null, 'Test')
    })

    const vm = new Component().$mount(el)

    const wrapper = createWrapper(vm)

    wrapper.vm.$meta().refresh()
    expect(body.getAttribute('foo')).toBe('bar')
    expect(body.getAttribute('data-vue-meta')).toBe('%7B%22foo%22:%7B%22ssr%22:%22bar%22%7D%7D')

    wrapper.vm.$meta().refresh()
    expect(body.getAttribute('foo')).toBe('bar')
    expect(body.getAttribute('data-vue-meta')).toBeNull()

    wrapper.vm.$meta().refresh()
    expect(body.getAttribute('foo')).toBe('bar')
    expect(body.getAttribute('data-vue-meta')).toBeNull()

    wrapper.destroy()
  })

  test('can toggle refreshOnceOnNavigation runtime', () => {
    const guards = {}
    const wrapper = mount(HelloWorld, {
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

    expect(guards.before).toBeUndefined()
    expect(guards.after).toBeUndefined()

    wrapper.vm.$meta().setOptions({ refreshOnceOnNavigation: true })

    expect(guards.before).not.toBeUndefined()
    expect(guards.after).not.toBeUndefined()
  })
})
