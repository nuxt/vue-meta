import Vue from 'vue'
import VueMeta from 'vue-meta'

Vue.use(VueMeta)

Vue.component('foo', {
  template: '<p>Foo component</p>',
  metaInfo: {
    title: 'Keep me Foo'
  }
})

new Vue({
  template: `
    <div id="app">
      <h1>Kept alive foo</h1>
      <button @click="show">Toggle Foo</button>
      <keep-alive>
        <foo v-if="showFoo"/>
      </keep-alive>
    </div>
  `,
  data () {
    return { showFoo: false }
  },
  methods: {
    show () {
      this.showFoo = !this.showFoo
    }
  },
  metaInfo: () => ({
    title: 'Keep-alive'
  })
}).$mount('#app')
