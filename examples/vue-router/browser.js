import { createApp } from './main'

const { app, router } = createApp('/vue-router')
router.isReady().then(() => app.mount('#app'))
