import { triggerUpdate, batchUpdate } from '../../src/client/update'
import { mount, vmTick, VueMetaPlugin, loadVueMetaPlugin } from '../utils'
import { defaultOptions } from '../../src/shared/constants'

jest.mock('../../src/client/update')
jest.mock('../../package.json', () => ({
  version: 'test-version'
}))

describe('plugin', () => {
  let Vue

  beforeEach(() => jest.clearAllMocks())
  beforeAll(() => (Vue = loadVueMetaPlugin(true)))

  test('not loaded when no metaInfo defined', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    process.server = false

    const instance = new Vue()
    expect(instance.$meta).toEqual(expect.any(Function))

    expect(instance.$meta().inject).toEqual(expect.any(Function))
    expect(instance.$meta().refresh).toEqual(expect.any(Function))
    expect(instance.$meta().getOptions).toEqual(expect.any(Function))

    expect(instance.$meta().inject()).toBeUndefined()
    expect(warn).toHaveBeenCalledTimes(1)
    expect(instance.$meta().refresh()).toEqual({})
    expect(warn).toHaveBeenCalledTimes(2)

    instance.$meta().getOptions()
    expect(warn).toHaveBeenCalledTimes(2)

    warn.mockRestore()
    delete process.server
  })

  test('is loaded', () => {
    const instance = new Vue({ metaInfo: {} })
    expect(instance.$meta).toEqual(expect.any(Function))

    expect(instance.$meta().inject).toEqual(expect.any(Function))
    expect(instance.$meta().refresh).toEqual(expect.any(Function))
    expect(instance.$meta().getOptions).toEqual(expect.any(Function))

    expect(instance.$meta().inject()).toBeUndefined()
    expect(instance.$meta().refresh()).toBeDefined()

    const options = instance.$meta().getOptions()
    expect(options).toBeDefined()
    expect(options.keyName).toBe(defaultOptions.keyName)
  })

  test('component has _hasMetaInfo set to true', () => {
    const Component = Vue.component('test-component', {
      template: '<div>Test</div>',
      [defaultOptions.keyName]: {
        title: 'Hello World'
      }
    })

    const { vm } = mount(Component, { localVue: Vue })
    expect(vm._hasMetaInfo).toBe(true)
  })

  test('plugin sets package version', () => {
    expect(VueMetaPlugin.version).toBe('test-version')
  })

  test('plugin isnt be installed twice', () => {
    expect(Vue.__vuemeta_installed).toBe(true)

    Vue.prototype.$meta = undefined
    Vue.use({ ...VueMetaPlugin })

    expect(Vue.prototype.$meta).toBeUndefined()

    // reset Vue
    Vue = loadVueMetaPlugin(true)
  })

  test('prints deprecation warning once when using _hasMetaInfo', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})

    const Component = Vue.component('test-component', {
      template: '<div>Test</div>',
      [defaultOptions.keyName]: {
        title: 'Hello World'
      }
    })

    Vue.config.devtools = true
    const { vm } = mount(Component, { localVue: Vue })

    expect(vm._hasMetaInfo).toBe(true)
    expect(warn).toHaveBeenCalledTimes(1)

    expect(vm._hasMetaInfo).toBe(true)
    expect(warn).toHaveBeenCalledTimes(1)
    warn.mockRestore()
  })

  test('can use hasMetaInfo export', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})

    const Component = Vue.component('test-component', {
      template: '<div>Test</div>',
      [defaultOptions.keyName]: {
        title: 'Hello World'
      }
    })

    const { vm } = mount(Component, { localVue: Vue })

    expect(VueMetaPlugin.hasMetaInfo(vm)).toBe(true)
    expect(warn).not.toHaveBeenCalled()

    warn.mockRestore()
  })

  test('can use generate export with options', () => {
    process.server = true
    const rawInfo = {
      meta: [{ charset: 'utf-8' }]
    }

    const metaInfo = VueMetaPlugin.generate(rawInfo, {
      ssrAppId: 'my-test-app-id'
    })
    expect(metaInfo.meta.text()).toBe('<meta data-vue-meta="my-test-app-id" charset="utf-8">')

    // no error on not provided metaInfo types
    expect(metaInfo.script.text()).toBe('')
  })

  test('warning when calling generate in browser build', () => {
    process.server = false
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})

    const rawInfo = {
      meta: [{ charset: 'utf-8' }]
    }

    const metaInfo = VueMetaPlugin.generate(rawInfo)
    expect(metaInfo).toBeUndefined()
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledWith('generate is not supported in browser builds')

    warn.mockRestore()
  })

  test('updates can be pausing and resumed', async () => {
    const { batchUpdate: _batchUpdate } = jest.requireActual('../../src/client/update')
    const batchUpdateSpy = batchUpdate.mockImplementation(_batchUpdate)
    // because triggerUpdate & batchUpdate reside in the same file we cant mock them both,
    // so just recreate the triggerUpdate fn by copying its implementation
    const triggerUpdateSpy = triggerUpdate.mockImplementation((options, vm, hookName) => {
      if (vm.$root._vueMeta.initialized && !vm.$root._vueMeta.pausing) {
        // batch potential DOM updates to prevent extraneous re-rendering
        batchUpdateSpy(() => vm.$meta().refresh())
      }
    })

    const Component = Vue.component('test-component', {
      metaInfo () {
        return {
          title: this.title
        }
      },
      props: {
        title: {
          type: String,
          default: ''
        }
      },
      template: '<div>Test</div>'
    })

    let title = 'first title'
    const wrapper = mount(Component, {
      localVue: Vue,
      propsData: {
        title
      }
    })

    // no batchUpdate on initialization
    expect(wrapper.vm.$root._vueMeta.initialized).toBe(false)
    expect(wrapper.vm.$root._vueMeta.pausing).toBeFalsy()
    expect(triggerUpdateSpy).toHaveBeenCalledTimes(1)
    expect(batchUpdateSpy).not.toHaveBeenCalled()
    jest.clearAllMocks()
    await vmTick(wrapper.vm)

    title = 'second title'
    wrapper.setProps({ title })

    // batchUpdate on normal update
    expect(wrapper.vm.$root._vueMeta.initialized).toBe(true)
    expect(wrapper.vm.$root._vueMeta.pausing).toBeFalsy()
    expect(triggerUpdateSpy).toHaveBeenCalledTimes(1)
    expect(batchUpdateSpy).toHaveBeenCalledTimes(1)
    jest.clearAllMocks()

    wrapper.vm.$meta().pause()
    title = 'third title'
    wrapper.setProps({ title })

    // no batchUpdate when pausing
    expect(wrapper.vm.$root._vueMeta.initialized).toBe(true)
    expect(wrapper.vm.$root._vueMeta.pausing).toBe(true)
    expect(triggerUpdateSpy).toHaveBeenCalledTimes(1)
    expect(batchUpdateSpy).not.toHaveBeenCalled()
    jest.clearAllMocks()

    const { metaInfo } = wrapper.vm.$meta().resume()
    expect(metaInfo.title).toBe(title)
  })

  test('updates are batched by default', async () => {
    jest.useFakeTimers()

    const { batchUpdate: _batchUpdate } = jest.requireActual('../../src/client/update')
    const batchUpdateSpy = batchUpdate.mockImplementation(_batchUpdate)
    const refreshSpy = jest.fn()
    // because triggerUpdate & batchUpdate reside in the same file we cant mock them both,
    // so just recreate the triggerUpdate fn by copying its implementation
    triggerUpdate.mockImplementation((options, vm, hookName) => {
      if (vm.$root._vueMeta.initialized && !vm.$root._vueMeta.pausing) {
        // batch potential DOM updates to prevent extraneous re-rendering
        batchUpdateSpy(refreshSpy)
      }
    })

    const Component = Vue.component('test-component', {
      metaInfo () {
        return {
          title: this.title
        }
      },
      props: {
        title: {
          type: String,
          default: ''
        }
      },
      template: '<div>Test</div>'
    })

    let title = 'first title'
    const wrapper = mount(Component, {
      localVue: Vue,
      propsData: {
        title
      }
    })
    await vmTick(wrapper.vm)
    jest.clearAllMocks()

    title = 'second title'
    wrapper.setProps({ title })
    jest.advanceTimersByTime(2)
    expect(refreshSpy).not.toHaveBeenCalled()
    jest.advanceTimersByTime(10)
    expect(refreshSpy).toHaveBeenCalled()
  })

  test('can set option waitOnDestroyed runtime', () => {
    const wrapper = mount({ render: h => h('div') }, { localVue: Vue })

    expect(wrapper.vm.$meta().getOptions().waitOnDestroyed).toBe(true)

    wrapper.vm.$meta().setOptions({ waitOnDestroyed: false })

    expect(wrapper.vm.$meta().getOptions().waitOnDestroyed).toBe(false)
  })

  test('can set option debounceWait runtime', () => {
    const wrapper = mount({ render: h => h('div') }, { localVue: Vue })

    expect(wrapper.vm.$meta().getOptions().debounceWait).toBe(10)

    wrapper.vm.$meta().setOptions({ debounceWait: 69420 })

    expect(wrapper.vm.$meta().getOptions().debounceWait).toBe(69420)
  })
})
