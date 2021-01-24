import { h, reactive, onUnmounted, Teleport, VNode, Comment } from 'vue'
import { isArray, isFunction } from '@vue/shared'
import { createMergedObject } from './object-merge'
import { renderMeta } from './render'
import { metaInfoKey } from './symbols'
import { Metainfo } from './Metainfo'
import type { ResolveMethod } from './object-merge'
import type { Manager, Config, Resolver, MetaContext, MetainfoActive } from './types'

export const ssrAttribute = 'data-vm-ssr'

export const active: MetainfoActive = reactive({})

export function addVnode (teleports: any, to: string, _vnodes: VNode | Array<VNode>) {
  const vnodes = (isArray(_vnodes) ? _vnodes : [_vnodes]) as Array<VNode>

  if (!__BROWSER__) {
    // dont add ssrAttribute for attribute vnode placeholder
    if (!to.endsWith('Attrs')) {
      vnodes.forEach((vnode) => {
        if (!vnode.props) {
          vnode.props = {}
        }
        vnode.props[ssrAttribute] = true
      })
    }
  } else {
    // Comments shouldnt have any use on the client as they are not reactive anyway
    vnodes.forEach((vnode, idx) => {
      if (vnode.type === Comment) {
        vnodes.splice(idx, 1)
      }
    })
  }

  if (!teleports[to]) {
    teleports[to] = []
  }

  teleports[to].push(...vnodes)
}

export function createMetaManager (config: Config, resolver: Resolver | ResolveMethod): Manager {
  const resolve: ResolveMethod = (options, contexts, active, key, pathSegments) => {
    if (isFunction(resolver)) {
      return resolver(options, contexts, active, key, pathSegments)
    }

    return resolver.resolve(options, contexts, active, key, pathSegments)
  }

  const { addSource, delSource } = createMergedObject(resolve, active)

  let cleanedUpSsr = false

  // TODO: validate resolver
  const manager: Manager = {
    config,

    install (app) {
      app.component('Metainfo', Metainfo)

      app.config.globalProperties.$metaManager = manager
      app.provide(metaInfoKey, active)
    },

    addMeta (metaObj, vm) {
      const resolveContext: MetaContext = { vm }
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

    render ({ slots }: any = {}): Array<VNode> {
      // cleanup ssr tags if not yet done
      if (__BROWSER__ && !cleanedUpSsr) {
        cleanedUpSsr = true

        // Listen for DOM loaded because tags in the body couldnt be loaded
        // yet once the manager does it first render
        // (preferable there should only be one render on hydration)
        window.addEventListener('DOMContentLoaded', () => {
          const ssrTags = document.querySelectorAll(`[${ssrAttribute}]`)

          if (ssrTags && ssrTags.length) {
            Array.from(ssrTags).forEach(el => el.parentNode && el.parentNode.removeChild(el))
          }
        })
      }

      const teleports: { [key: string]: VNode | Array<VNode> } = {}

      for (const key in active) {
        const config = this.config[key] || {}

        const vnode = renderMeta(
          { metainfo: active, slots },
          key,
          active[key],
          config
        )

        if (!vnode) {
          continue
        }

        const vnodes = isArray(vnode) ? vnode : [vnode]

        const defaultTo = (key !== 'base' && active[key].to) || config.to || (config.attributesFor ? key : 'head')

        for (const { to, vnode } of vnodes) {
          addVnode(teleports, to || defaultTo, vnode)
        }
      }

      if (slots) {
        for (const tag in slots) {
          const slotFn = slots[tag]
          if (isFunction(slotFn)) {
            addVnode(teleports, tag === 'default' ? 'head' : tag, slotFn({ metainfo: active }))
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
