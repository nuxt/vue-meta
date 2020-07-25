import Vue from 'vue'
import VueMeta from 'vue-meta'
import App from './App.vue'
import createRouter from './router'

Vue.use(VueMeta)

App.router = createRouter()

new Vue(App).$mount('#app')
