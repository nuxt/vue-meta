import { createApp } from 'vue'
import { App, createRouter, metaManager } from '../vue-router/main'

window.users = []

const app = createApp(App)
app.use(createRouter('/ssr'))
app.use(metaManager)
app.mount('#app')
