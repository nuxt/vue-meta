import Vue from 'vue'
import getComponentOption from '../src/shared/getComponentOption'

describe('getComponentOption', () => {
  const container = document.createElement('div')
  let component

  afterEach(() => component.$destroy())

  it('returns an empty object when no matching options are found', () => {
    component = new Vue()
    const mergedOption = getComponentOption({ component, option: 'noop' })
    expect(mergedOption).to.eql({})
  })

  it('fetches the given option from the given component', () => {
    component = new Vue({ someOption: 'foo' })
    const mergedOption = getComponentOption({ component, option: 'someOption' })
    expect(mergedOption).to.eql('foo')
  })

  it('calls a function option, injecting the component as context', () => {
    component = new Vue({
      name: 'foobar',
      someFunc () {
        return this.$options.name
      }
    })
    const mergedOption = getComponentOption({ component, option: 'someFunc' })
    expect(mergedOption).to.eql('foobar')
  })

  it('fetches deeply nested component options and merges them', () => {
    Vue.component('merge-child', { template: '<div></div>', foo: { bar: 'baz' } })

    component = new Vue({
      foo: { fizz: 'buzz' },
      render: (h) => h('div', null, [h('merge-child')]),
      el: container
    })

    const mergedOption = getComponentOption({ component, option: 'foo', deep: true })
    expect(mergedOption).to.eql({ bar: 'baz', fizz: 'buzz' })
  })

  it('allows for a custom array merge strategy', () => {
    Vue.component('array-child', {
      template: '<div></div>',
      foo: [
        { name: 'flower', content: 'rose' }
      ]
    })

    component = new Vue({
      render: (h) => h('div', null, [h('array-child')]),
      foo: [
        { name: 'flower', content: 'tulip' }
      ],
      el: container
    })

    const mergedOption = getComponentOption({
      component,
      option: 'foo',
      deep: true,
      arrayMerge (target, source) {
        return target.concat(source)
      }
    })

    expect(mergedOption).to.eql([
      { name: 'flower', content: 'tulip' },
      { name: 'flower', content: 'rose' }
    ])
  })
})
