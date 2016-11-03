import Vue from 'vue'
import Meta from 'vue-meta'

import { Promise } from 'es6-promise'

Vue.use(Meta)

describe('basic', () => {
  const container = document.createElement('div')
  let vm

  function setMetaInfo (metaInfo) {
    return new Promise((resolve) => {
      metaInfo = Vue.util.extend(metaInfo, { changed: resolve })
      vm = new Vue({ el: container, metaInfo })
    })
  }

  afterEach(() => vm.$destroy())

  it('sets a title', () => setMetaInfo({ title: 'Foo' })
    .then(() => expect(document.title).to.equal('Foo')))

  it('sets a title with a template', () => setMetaInfo({
    title: 'Foo',
    titleTemplate: '%s Bar'
  })
    .then(() => expect(document.title).to.equal('Foo Bar')))
})
