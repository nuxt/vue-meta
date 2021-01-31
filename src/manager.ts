import { h, reactive, onUnmounted, Teleport, Comment, getCurrentInstance } from 'vue'
import type { VNode } from 'vue'
import { isArray, isFunction } from '@vue/shared'
import { createMergedObject } from './object-merge'
import { renderMeta } from './render'
import { metaActiveKey } from './symbols'
import { Metainfo } from './Metainfo'
import type { ResolveMethod } from './object-merge'
import type {
  MetaActive,
  MetaConfig,
  MetaManager,
  MetaResolver,
  MetaResolveContext,
  MetaTeleports
} from './types'

export const ssrAttribute = 'data-vm-ssr'

export const active: MetaActive = reactive({})

export function addVnode (teleports: MetaTeleports, to: string, vnodes: VNode | Array<VNode>): void {
  const nodes = (isArray(vnodes) ? vnodes : [vnodes]) as Array<VNode>

  if (__BROWSER__) {
    // Comments shouldnt have any use on the client as they are not reactive anyway
    nodes.forEach((vnode, idx) => {
      if (vnode.type === Comment) {
        nodes.splice(idx, 1)
      }
    })
  // only add ssrAttribute's for real meta tags
  } else if (!to.endsWith('Attrs')) {
    nodes.forEach((vnode) => {
      if (!vnode.props) {
        vnode.props = {}
      }
      vnode.props[ssrAttribute] = true
    })
  }

  if (!teleports[to]) {
    teleports[to] = []
  }

  teleports[to].push(...nodes)
}

export function createMetaManager (config: MetaConfig, resolver: MetaResolver | ResolveMethod): MetaManager {
  let cleanedUpSsr = false

  const resolve: ResolveMethod = (options, contexts, active, key, pathSegments) => {
    if (isFunction(resolver)) {
      return resolver(options, contexts, active, key, pathSegments)
    }

    return resolver.resolve(options, contexts, active, key, pathSegments)
  }

  const { addSource, delSource } = createMergedObject(resolve, active)

  // TODO: validate resolver
  const manager: MetaManager = {
    config,

    install (app) {
      app.component('Metainfo', Metainfo)

      app.config.globalProperties.$metaManager = manager
      app.provide(metaActiveKey, active)
    },

    addMeta (metaObj, vm) {
      if (!vm) {
        vm = getCurrentInstance() || undefined
      }

      const resolveContext: MetaResolveContext = { vm }
      if (resolver && 'setup' in resolver && isFunction(resolver.setup)) {
        resolver.setup(resolveContext)
      }

      // TODO: optimize initial compute
      const meta = addSource(metaObj, resolveContext, true)

      const unmount = () => delSource(meta)
      if (vm) {
        onUnmounted(unmount)
      }

      return {
        meta,
        unmount
      }
    },

    render ({ slots } = {}) {
      // cleanup ssr tags if not yet done
      if (__BROWSER__ && !cleanedUpSsr) {
        cleanedUpSsr = true

        // Listen for DOM loaded because tags in the body couldnt
        // have loaded yet once the manager does it first render
        // (preferable there should only be one meta render on hydration)
        window.addEventListener('DOMContentLoaded', () => {
          const ssrTags = document.querySelectorAll(`[${ssrAttribute}]`)

          if (ssrTags && ssrTags.length) {
            Array.from(ssrTags).forEach(el => el.parentNode && el.parentNode.removeChild(el))
          }
        })
      }

      const teleports: MetaTeleports = {}

      for (const key in active) {
        const config = this.config[key] || {}

        let renderedNodes = renderMeta(
          { metainfo: active, slots },
          key,
          active[key],
          config
        )

        if (!renderedNodes) {
          continue
        }

        if (!isArray(renderedNodes)) {
          renderedNodes = [renderedNodes]
        }

        let defaultTo = key !== 'base' && active[key].to

        if (!defaultTo && 'to' in config) {
          defaultTo = config.to
        }

        if (!defaultTo && 'attributesFor' in config) {
          defaultTo = key
        }

        for (const { to, vnode } of renderedNodes) {
          addVnode(teleports, to || defaultTo || 'head', vnode)
        }
      }

      if (slots) {
        for (const slotName in slots) {
          const tagName = slotName === 'default' ? 'head' : slotName

          // Only teleport the contents of head/body slots
          if (tagName !== 'head' && tagName !== 'body') {
            continue
          }

          const slot = slots[slotName]
          if (isFunction(slot)) {
            addVnode(teleports, tagName, slot({ metainfo: active }))
          }
        }
      }

      return Object.keys(teleports).map((to) => {
        return h(Teleport, { to }, teleports[to])
      })
    }
  }

  return manager
}
