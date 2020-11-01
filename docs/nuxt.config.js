import theme from '@nuxt/content-theme-docs'

export default theme({
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
