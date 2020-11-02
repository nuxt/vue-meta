import path from 'path'

import theme from '@nuxt/content-theme-docs'

export default theme({
  css: [path.resolve(__dirname, './assets/custom.css')],
  generate: {
    routes: ['/'],
    dir: '.vuepress/dist'
  },
  buildModules: [
    '@nuxtjs/google-analytics'
  ],
  googleAnalytics: {
    id: 'UA-88662854-1'
  }
})
