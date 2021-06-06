import { h, createApp as createVueApp, createSSRApp } from 'vue'
import { createRouter as createVueRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import { createMetaManager as createVueMetaManager, defaultConfig, useMeta, plugin } from '../../src'
import * as deepestResolver from '../../src/resolvers/deepest'
import App from './App'
import PageComponent from './Page'
import PageOptions from './Options'

function createPage () {
  return {
    render: () => h(PageComponent)
  }
}
/*
const decisionMaker5000000 = resolveOption((prevValue, context) => {
  const { uid = 0 } = context.vm || {}
  if (!prevValue || prevValue < uid) {
    return uid
  }
})
*/
const createMetaManager = (isSSR = false) => createVueMetaManager(
  isSSR,
  {
    ...defaultConfig,
    esi: {
      group: true,
      namespaced: true
      // TODO?: attributes: ['src', 'test', 'text']
    }
  },
  deepestResolver
)

const createRouter = (base: string, isSSR = false) => createVueRouter({
  history: isSSR ? createMemoryHistory(base) : createWebHistory(base),
  routes: [
    { name: 'home', path: '/', component: createPage() },
    { name: 'about', path: '/about', component: createPage() },
    { name: 'options', path: '/options', component: PageOptions }
  ]
})

const createApp = (base: string, isSSR = null) => {
  const app = isSSR === null ? createVueApp(App) : createSSRApp(App)
  const router = createRouter(base, !!isSSR)
  const metaManager = createMetaManager(!!isSSR)

  app.use(router)
  app.use(metaManager)
  app.use(plugin)

  useMeta(
    {
      og: {
        something: 'test'
      }
    },
    metaManager
  ) /**/

  return {
    app,
    router,
    metaManager
  }
}

export {
  createApp,
  createMetaManager,
  createRouter
}
