import { createApp } from '../vue-router/main'

window.users = []

const { app, router } = createApp('/ssr', null)
router.isReady().then(() => app.mount('#app'))
