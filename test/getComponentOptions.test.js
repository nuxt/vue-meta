import getComponentOption from '../src/shared/getComponentOption'
import { mount, getVue, loadVueMetaPlugin } from './utils'

describe('getComponentOption', () => {
  let Vue

  beforeAll(() => (Vue = getVue()))

  it('returns an empty object when no matching options are found', () => {
    const component = new Vue()
    const mergedOption = getComponentOption({ component, keyName: 'noop' })
    expect(mergedOption).toEqual({})
  })

  it('fetches the given option from the given component', () => {
    const component = new Vue({ someOption: 'foo' })
    const mergedOption = getComponentOption({ component, keyName: 'someOption' })
    expect(mergedOption).toEqual('foo')
  })

  it('calls a function option, injecting the component as context', () => {
    const component = new Vue({
      name: 'Foobar',
      someFunc() {
        return this.$options.name
      }
    })
    const mergedOption = getComponentOption({ component, keyName: 'someFunc' })
    // TODO: Should this be foobar or Foobar
    expect(mergedOption).toEqual('Foobar')
  })

  it('fetches deeply nested component options and merges them', () => {
    const localVue = loadVueMetaPlugin(true, { keyName: 'foo' })
    localVue.component('merge-child', { render: h => h('div'), foo: { bar: 'baz' } })

    const component = localVue.component('parent', {
      foo: { fizz: 'buzz' },
      render: h => h('div', null, [h('merge-child')])
    })

    const wrapper = mount(component, { localVue })

    const mergedOption = getComponentOption({ component: wrapper.vm, keyName: 'foo' })
    expect(mergedOption).toEqual({ bar: 'baz', fizz: 'buzz' })
  })

  it('allows for a custom array merge strategy', () => {
    const localVue = loadVueMetaPlugin(false, { keyName: 'foo' })
    localVue.component('array-child', {
      render: h => h('div'),
      foo: {
        meta: [
          { name: 'flower', content: 'rose' }
        ]
      }
    })

    const component = localVue.component('parent', {
      foo: {
        meta: [
          { name: 'flower', content: 'tulip' }
        ]
      },
      render: h => h('div', null, [h('array-child')])
    })

    const wrapper = mount(component, { localVue })

    const mergedOption = getComponentOption({
      component: wrapper.vm,
      keyName: 'foo',
      arrayMerge(target, source) {
        return target.concat(source)
      }
    })

    expect(mergedOption).toEqual({ meta: [
      { name: 'flower', content: 'tulip' },
      { name: 'flower', content: 'rose' }
    ] })
  })
})
