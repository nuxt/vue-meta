import Vue from 'vue'
import store from './store'
import router from './router'
import App from './App.vue'

App.router = router
App.store = store

new Vue(App).$mount('#app')
