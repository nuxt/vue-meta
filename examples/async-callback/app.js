import Vue from 'vue'
import VueMeta from 'vue-meta'

Vue.use(VueMeta)

window.users = []

new Vue({
  metaInfo () {
    return {
      title: 'Async Callback',
      titleTemplate: '%s | Vue Meta Examples',
      script: [
        {
          skip: this.count < 2,
          vmid: 'potatoes',
          src: '/user-3.js',
          async: true,
          callback: this.updateCounter
        },
        {
          skip: this.count < 1,
          vmid: 'vegetables',
          src: '/user-2.js',
          async: true,
          callback: this.updateCounter
        },
        {
          vmid: 'meat',
          src: '/user-1.js',
          async: true,
          callback: el => this.loadCallback(el.dataset.vmid)
        },
        ...this.scripts
      ]
    }
  },
  data () {
    return {
      count: 0,
      scripts: [],
      users: window.users
    }
  },
  watch: {
    count (val) {
      if (val === 3) {
        this.addScript()
      }
    }
  },
  methods: {
    updateCounter () {
      this.count++
    },
    addScript () {
      this.scripts.push({
        src: '/user-4.js',
        callback: () => {
          this.updateCounter()
        }
      })
    },
    loadCallback (vmid) {
      if (vmid === 'meat') {
        this.updateCounter()
      }
    }
  },
  template: `
    <div id="app">
      <h1>Async Callback</h1>
      <p>{{ count }} scripts loaded</p>

      <div>
        <h2>Users</h2>
        <ul>
          <li
            v-for="({ id, name }) in users"
            :key="id"
          >
          <strong>{{ id }}</strong>: {{ name }}
          </li>
        </ul>
      </div>
    </div>
  `
}).$mount('#app')
