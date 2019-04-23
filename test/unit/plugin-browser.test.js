import { triggerUpdate, batchUpdate } from '../../src/client/update'
import { mount, vmTick, VueMetaBrowserPlugin, loadVueMetaPlugin } from '../utils'
import { defaultOptions } from '../../src/shared/constants'

jest.mock('../../src/client/update')
jest.mock('../../package.json', () => ({
  version: 'test-version'
}))

describe('plugin', () => {
  let Vue

  beforeEach(() => jest.clearAllMocks())
  beforeAll(() => (Vue = loadVueMetaPlugin(true)))

  test('is loaded', () => {
    const instance = new Vue()
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
    expect(VueMetaBrowserPlugin.version).toBe('test-version')
  })

  test('updates can be paused and resumed', async () => {
    const { batchUpdate: _batchUpdate } = jest.requireActual('../../src/client/update')
    const batchUpdateSpy = batchUpdate.mockImplementation(_batchUpdate)
    // because triggerUpdate & batchUpdate reside in the same file we cant mock them both,
    // so just recreate the triggerUpdate fn by copying its implementation
    const triggerUpdateSpy = triggerUpdate.mockImplementation((vm, hookName) => {
      if (vm.$root._vueMeta.initialized && !vm.$root._vueMeta.paused) {
        // batch potential DOM updates to prevent extraneous re-rendering
        batchUpdateSpy(() => vm.$meta().refresh())
      }
    })

    const Component = Vue.component('test-component', {
      metaInfo() {
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
    expect(wrapper.vm.$root._vueMeta.paused).toBeFalsy()
    expect(triggerUpdateSpy).toHaveBeenCalledTimes(1)
    expect(batchUpdateSpy).not.toHaveBeenCalled()
    jest.clearAllMocks()
    await vmTick(wrapper.vm)

    title = 'second title'
    wrapper.setProps({ title })

    // batchUpdate on normal update
    expect(wrapper.vm.$root._vueMeta.initialized).toBe(true)
    expect(wrapper.vm.$root._vueMeta.paused).toBeFalsy()
    expect(triggerUpdateSpy).toHaveBeenCalledTimes(1)
    expect(batchUpdateSpy).toHaveBeenCalledTimes(1)
    jest.clearAllMocks()

    wrapper.vm.$meta().pause()
    title = 'third title'
    wrapper.setProps({ title })

    // no batchUpdate when paused
    expect(wrapper.vm.$root._vueMeta.initialized).toBe(true)
    expect(wrapper.vm.$root._vueMeta.paused).toBe(true)
    expect(triggerUpdateSpy).toHaveBeenCalledTimes(1)
    expect(batchUpdateSpy).not.toHaveBeenCalled()
    jest.clearAllMocks()

    const { metaInfo } = wrapper.vm.$meta().resume()
    expect(metaInfo.title).toBe(title)
  })

  test('updates are batched', async () => {
    jest.useFakeTimers()

    const { batchUpdate: _batchUpdate } = jest.requireActual('../../src/client/update')
    const batchUpdateSpy = batchUpdate.mockImplementation(_batchUpdate)
    const refreshSpy = jest.fn()
    // because triggerUpdate & batchUpdate reside in the same file we cant mock them both,
    // so just recreate the triggerUpdate fn by copying its implementation
    triggerUpdate.mockImplementation((vm, hookName) => {
      if (vm.$root._vueMeta.initialized && !vm.$root._vueMeta.paused) {
        // batch potential DOM updates to prevent extraneous re-rendering
        batchUpdateSpy(refreshSpy)
      }
    })

    const Component = Vue.component('test-component', {
      metaInfo() {
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
})
