import { createApp } from 'vue'
import { App, createRouter, metaManager } from './main'

const app = createApp(App)
app.use(createRouter('/vue-router'))
app.use(metaManager)
app.mount('#app')
