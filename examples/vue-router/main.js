import { h } from 'vue'
import { createRouter as createVueRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import { createMetaManager, defaultConfig, resolveOption, useMeta } from 'vue-meta'
import App from './App'
import ChildComponent from './Child'

function createView (page) {
  return {
    name: `section-${page}`,
    render () {
      return h(ChildComponent, { page })
    }
  }
}

const decisionMaker5000000 = resolveOption((prevValue, context) => {
  const { uid = 0 } = context.vm || {}
  if (!prevValue || prevValue < uid) {
    return uid
  }
})

const metaManager = createMetaManager({
  ...defaultConfig,
  esi: {
    group: true,
    namespaced: true,
    attributes: ['src', 'test', 'text']
  }
}, decisionMaker5000000)

useMeta(
  {
    og: {
      something: 'test'
    }
  },
  metaManager
) /**/

const createRouter = (base, isSSR) => createVueRouter({
  history: isSSR ? createMemoryHistory(base) : createWebHistory(base),
  routes: [
    { name: 'home', path: '/', component: createView('home') },
    { name: 'about', path: '/about', component: createView('about') }
  ]
})

export {
  App,
  metaManager,
  createRouter,
  createView
}
