import { getComponentOption } from '../../src/shared/getComponentOption'
import { inMetaInfoBranch } from '../../src/shared/meta-helpers'
import { mount, getVue, loadVueMetaPlugin } from '../utils'

describe('getComponentOption', () => {
  let Vue

  beforeAll(() => (Vue = getVue()))

  test('returns an empty object when no matching options are found', () => {
    const component = new Vue()
    const mergedOption = getComponentOption({ keyName: 'noop' }, component)
    expect(mergedOption).toEqual({})
  })

  test('fetches the given option from the given component', () => {
    const component = new Vue({ someOption: { foo: 'bar' } })
    const mergedOption = getComponentOption({ keyName: 'someOption' }, component)
    expect(mergedOption.foo).toBeDefined()
    expect(mergedOption.foo).toEqual('bar')
  })

  test('calls a function as computed prop, injecting the component as context', () => {
    const component = new Vue({
      name: 'Foobar',
      someFunc () {
        return { opt: this.name }
      },
      computed: {
        $metaInfo () {
          return this.$options.someFunc()
        }
      }
    })

    const mergedOption = getComponentOption({ keyName: 'someFunc' }, component)
    // TODO: Should this be foobar or Foobar
    expect(mergedOption.opt).toBeDefined()
    expect(mergedOption.opt).toEqual('Foobar')
  })

  test('fetches deeply nested component options and merges them', () => {
    const localVue = loadVueMetaPlugin({ keyName: 'foo' })
    localVue.component('merge-child', { render: h => h('div'), foo: { bar: 'baz' } })

    const component = localVue.component('parent', {
      foo: { fizz: 'buzz' },
      render: h => h('div', null, [h('merge-child')])
    })

    const wrapper = mount(component, { localVue })

    const mergedOption = getComponentOption({ keyName: 'foo' }, wrapper.vm)
    expect(mergedOption).toEqual({ bar: 'baz', fizz: 'buzz' })
  })

  /* this undocumented functionality has been removed
  test('allows for a custom array merge strategy', () => {
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
  }) */

  test('only traverses branches with metaInfo components', () => {
    const localVue = loadVueMetaPlugin({ keyName: 'foo' })

    localVue.component('meta-child', {
      foo: { bar: 'baz' },
      render (h) {
        return h('div', this.$slots.default)
      }
    })

    localVue.component('nometa-child', {
      render (h) {
        return h('div', this.$slots.default)
      }
    })

    const component = localVue.component('parent', {
      render: h => h('div', null, [
        h('meta-child', null, [ h('nometa-child') ]),
        h('nometa-child', null, [ h('meta-child') ]),
        h('nometa-child')
      ])
    })

    const wrapper = mount(component, { localVue })

    const mergedOption = getComponentOption({ keyName: 'foo' }, wrapper.vm)

    expect(mergedOption).toEqual({ bar: 'baz' })
    expect(wrapper.vm.$children[0]._vueMeta).toBe(true)
    expect(wrapper.vm.$children[1]._vueMeta).toBe(false)
    expect(wrapper.vm.$children[2]._vueMeta).toBeUndefined()

    expect(inMetaInfoBranch(wrapper.vm.$children[0])).toBe(true)
    expect(inMetaInfoBranch(wrapper.vm.$children[0].$children[0])).toBe(false)
    expect(inMetaInfoBranch(wrapper.vm.$children[1])).toBe(true)
    expect(inMetaInfoBranch(wrapper.vm.$children[1].$children[0])).toBe(true)
    expect(inMetaInfoBranch(wrapper.vm.$children[2])).toBe(false)
  })
})
