import Vue from 'vue'
import Meta from 'vue-meta'

Vue.use(Meta)

describe('basic', () => {
  it('sets the document title', () => {
    new Vue({
      template: `
        <div id="app">
        </div>
      `,
      metaInfo: {
        title: 'Foo'
      }
    }).$mount()
    expect(document.title).to.equal('Foo')
  })
})
