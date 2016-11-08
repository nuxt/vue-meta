import assign from 'object-assign'
import Vue from 'vue'
import store from './store'
import router from './router'
import App from './App.vue'

const app = new Vue(assign(App, { router, store }))

app.$mount('#app')
