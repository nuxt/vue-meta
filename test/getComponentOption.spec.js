import Vue from 'vue'
import getComponentOption from '../src/shared/getComponentOption'

describe('getComponentOption', () => {
  const container = document.createElement('div')
  let component

  afterEach(() => component.$destroy())

  it('fetches the given option from the given component', () => {
    component = new Vue({ someOption: 'foo' })
    const fetchedOption = getComponentOption({ component, option: 'someOption' })
    expect(fetchedOption).to.eql('foo')
  })

  it('fetches deeply nested component options and merges them', () => {
    Vue.component('merge-child', { template: '<div></div>', foo: { bar: 'baz' } })

    component = new Vue({
      foo: { fizz: 'buzz' },
      render: (h) => h('div', null, [h('merge-child')]),
      el: container
    })

    const fetchedOption = getComponentOption({ component, option: 'foo', deep: true })
    expect(fetchedOption).to.eql({ bar: 'baz', fizz: 'buzz' })
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

    const fetchedOption = getComponentOption({
      component,
      option: 'foo',
      deep: true,
      arrayMerge (target, source) {
        return target.concat(source)
      }
    })

    expect(fetchedOption).to.eql([
      { name: 'flower', content: 'tulip' },
      { name: 'flower', content: 'rose' }
    ])
  })
})
