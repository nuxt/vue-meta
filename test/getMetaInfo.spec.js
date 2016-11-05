import Vue from 'vue'
import getMetaInfo from '../src/shared/getMetaInfo'

describe('getMetaInfo', () => {
  // const container = document.createElement('div')
  let component

  afterEach(() => component.$destroy())

  it('returns appropriate defaults when no meta info is found', () => {
    component = new Vue()
    expect(getMetaInfo(component)).to.eql({
      title: '',
      titleChunk: '',
      titleTemplate: '%s',
      htmlAttrs: {},
      bodyAttrs: {},
      meta: [],
      base: [],
      link: [],
      style: [],
      script: [],
      noscript: []
    })
  })
})
