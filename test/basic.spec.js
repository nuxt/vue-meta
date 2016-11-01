import Vue from 'vue'
import Meta from 'vue-meta'

Vue.use(Meta)

before(() => {
  new Vue({
    template: `
      <div id="app">
      </div>
    `,
    metaInfo: {
      title: 'Foo'
    }
  }).$mount()
})

describe('basic', () => {
  it('sets the document title', (done) => {
    setTimeout(() => {
      expect(document.title).to.equal('Foo')
      done()
    }, 100)
  })
})
