import Vue from 'vue'
import VueMeta from 'vue-meta'

Vue.use(VueMeta)

Vue.component('Foo', {
  template: '<p>Foo component</p>',
  metaInfo: {
    title: 'Keep me Foo'
  }
})

new Vue({
  data () {
    return { showFoo: false }
  },
  methods: {
    show () {
      this.showFoo = !this.showFoo
    }
  },
  template: `
    <div id="app">
      <h1>Kept alive foo</h1>
      <button @click="show">Toggle Foo</button>
      <keep-alive>
        <foo v-if="showFoo"/>
      </keep-alive>
    </div>
  `,
  metaInfo: () => ({
    title: 'Keep-alive'
  })
}).$mount('#app')
