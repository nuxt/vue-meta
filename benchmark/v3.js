import Vue from 'vue'
import { promisify } from 'util'
import LRU from 'lru-cache'
import { createRenderer, createBundleRenderer } from 'vue-server-renderer'

const renderToString = promisify(createRenderer().renderToString)
const cachedToString = promisify(createRenderer({
  cache: new LRU()
}).renderToString)

function renderChilds(h, metaInfo) {
  const children = []

  Object.keys(metaInfo).forEach(k => {
    if (Array.isArray(metaInfo[k])) {
      metaInfo[k].forEach(attrs => {
        const html = attrs.innerHTML
        delete attrs.innerHTML
        children.push(h(k, { attrs }, html))
      })
      return
    }

    if (k === 'title') {
      children.push(h('title', null, metaInfo[k]))
    }
  })

  return children
}


export async function v3(metaInfo) {
  const head = new Vue({
    render(h) {
      return h('head', null, renderChilds(h, metaInfo))
    }
  })

  return await renderToString(head)
}

export async function v3cached(metaInfo) {
  const head = new Vue({
    render(h) {
      return h('head', null, renderChilds(h, metaInfo))
    }
  })

  return await cachedToString(head)
}

const head = new Vue({
  data: {
    metaInfo: {}
  },
  render(h) {
    const metaInfo = this.metaInfo
    return h('head', null, renderChilds(h, metaInfo))
  }
})

export async function v3binding(metaInfo) {
  head.metaInfo = metaInfo
  return await cachedToString(head)
}
