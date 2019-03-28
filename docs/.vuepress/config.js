module.exports = {
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Vue Meta',
      description: 'Metadata manager for Vue.js'
    },
  },
  ga: 'UA-88662854-1',
  serviceWorker: true,
  themeConfig: {
    repo: 'nuxt/vue-meta',
    docsDir: 'docs',
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        nav: [{
          text: 'Guide',
          link: '/guide/'
        }, {
          text: 'API',
          link: '/api/'
        }, {
          text: 'Release Notes',
          link: 'https://github.com/nuxt/vue-meta/releases'
        }],
        sidebar: [
          '/installation.md',
          '/',
          {
            title: 'Usage',
            collapsable: false,
            children: [
              '/guide/',
              '/guide/ssr',
              '/guide/metainfo',
              '/guide/special',
              '/guide/caveats',
            ]
          },
          {
            title: 'FAQ',
            collapsable: false,
            children: [
              '/faq/',
              '/faq/performance.md',
              '/faq/prevent-initial.md',
              '/faq/component-props.md',
              '/faq/async-action.md',
            ]
          },
          /*{
            title: 'Advanced',
            collapsable: false,
            children: [
              '/guide/advanced/navigation-guards.md',
              '/guide/advanced/meta.md',
              '/guide/advanced/transitions.md',
              '/guide/advanced/data-fetching.md',
              '/guide/advanced/scroll-behavior.md',
              '/guide/advanced/lazy-loading.md'
            ]
          }*/
        ]
      },
    }
  }
}
