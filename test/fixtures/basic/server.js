import Vue from 'vue'
import { _import, getVueMetaPath } from '../../utils/build'
import App from './App.vue'
import createRouter from './router'

export default async function createServerApp () {
  const VueMeta = await _import(getVueMetaPath())

  Vue.use(VueMeta)

  App.router = createRouter()

  return new Vue(App)
}
