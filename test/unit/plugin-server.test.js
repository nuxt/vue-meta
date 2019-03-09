import { mount, VueMetaServerPlugin, loadVueMetaPlugin } from '../utils'
import { defaultOptions } from '../utils/constants'

jest.mock('../../package.json', () => ({
  version: 'test-version'
}))

describe('plugin', () => {
  let Vue

  beforeEach(() => jest.clearAllMocks())
  beforeAll(() => (Vue = loadVueMetaPlugin()))

  test('is loaded', () => {
    const instance = new Vue()
    expect(instance.$meta).toEqual(expect.any(Function))

    expect(instance.$meta().inject).toEqual(expect.any(Function))
    expect(instance.$meta().refresh).toEqual(expect.any(Function))
    expect(instance.$meta().getOptions).toEqual(expect.any(Function))

    expect(instance.$meta().inject()).toBeDefined()
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
    expect(VueMetaServerPlugin.version).toBe('test-version')
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

    expect(VueMetaServerPlugin.hasMetaInfo(vm)).toBe(true)
    expect(warn).not.toHaveBeenCalled()

    warn.mockRestore()
  })
})
