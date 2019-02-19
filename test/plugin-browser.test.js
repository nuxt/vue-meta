import { mount, defaultOptions, VueMetaBrowserPlugin, loadVueMetaPlugin } from './utils'

jest.mock('../package.json', () => ({
  version: 'test-version'
}))

describe('plugin', () => {
  let Vue

  beforeAll(() => (Vue = loadVueMetaPlugin(true)))

  test('is loaded', () => {
    const instance = new Vue()
    expect(instance.$meta).toEqual(expect.any(Function))

    expect(instance.$meta().inject).toEqual(expect.any(Function))
    expect(instance.$meta().refresh).toEqual(expect.any(Function))

    expect(instance.$meta().inject()).toBeUndefined()
    expect(instance.$meta().refresh()).toBeDefined()
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
})
