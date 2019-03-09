import Vue from 'vue'
import VueMeta from '../../../src'
import App from './App.vue'
import createRouter from './router'

Vue.use(VueMeta)

App.router = createRouter()

export default new Vue(App)
