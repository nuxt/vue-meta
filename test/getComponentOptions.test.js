import getComponentOption from '../src/shared/getComponentOption'
import { getVue } from './utils'

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
    Vue.component('merge-child', { render: h => h('div'), foo: { bar: 'baz' } })

    const component = new Vue({
      foo: { fizz: 'buzz' },
      el: document.createElement('div'),
      render: h => h('div', null, [h('merge-child')])
    })

    const mergedOption = getComponentOption({ component, keyName: 'foo', deep: true })
    expect(mergedOption).toEqual({ bar: 'baz', fizz: 'buzz' })
  })

  it('allows for a custom array merge strategy', () => {
    Vue.component('array-child', {
      render: h => h('div'),
      foo: [
        { name: 'flower', content: 'rose' }
      ]
    })

    const component = new Vue({
      foo: [
        { name: 'flower', content: 'tulip' }
      ],
      el: document.createElement('div'),
      render: h => h('div', null, [h('array-child')])
    })

    const mergedOption = getComponentOption({
      component,
      keyName: 'foo',
      deep: true,
      arrayMerge(target, source) {
        return target.concat(source)
      }
    })

    expect(mergedOption).toEqual([
      { name: 'flower', content: 'tulip' },
      { name: 'flower', content: 'rose' }
    ])
  })
})
