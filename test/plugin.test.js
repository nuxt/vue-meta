import { mount, defaultOptions, VueMetaPlugin, loadVueMetaPlugin } from './utils'

jest.mock('../package.json', () => ({
  version: 'test-version'
}))

describe('plugin', () => {
  let Vue

  beforeAll(() => (Vue = loadVueMetaPlugin()))

  test('is loaded', () => {
    const instance = new Vue()
    expect(instance.$meta).toEqual(expect.any(Function))
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
})
