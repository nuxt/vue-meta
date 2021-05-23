import { h, reactive, onUnmounted, App, Teleport, Comment, getCurrentInstance, ComponentInternalInstance, Slots } from 'vue'
import { isArray, isFunction } from '@vue/shared'
import { createMergedObject, MergedObjectBuilder } from './object-merge'
import { renderMeta } from './render'
import { metaActiveKey } from './symbols'
import { Metainfo } from './Metainfo'
import { defaultConfig } from './config/default'
import * as defaultResolver from './resolvers/deepest'
import type { VNode, ComponentPublicInstance } from 'vue'
import type { ResolveMethod } from './object-merge'

import type {
  MetaActive,
  MetaConfig,
  MetaGuards,
  MetaGuardRemoved,
  MetaResolver,
  MetaResolveContext,
  MetaTeleports,
  MetaSource,
  MetaProxy
} from './types'

export const ssrAttribute = 'data-vm-ssr'

export function addVnode (isSSR: boolean, teleports: MetaTeleports, to: string, vnodes: VNode | Array<VNode>): void {
  const nodes = (isArray(vnodes) ? vnodes : [vnodes]) as Array<VNode>

  if (!isSSR) {
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

// eslint-disable-next-line no-use-before-define
export type CreateMetaManagerMethod = (isSSR: boolean, config: MetaConfig, resolver: MetaResolver | ResolveMethod) => MetaManager

export const createMetaManager = (isSSR = false, config?: MetaConfig, resolver?: MetaResolver): MetaManager => MetaManager.create(isSSR, config || defaultConfig, resolver || (defaultResolver as MetaResolver))

export class MetaManager {
  isSSR = false
  config: MetaConfig
  target: MergedObjectBuilder<MetaSource>
  resolver?: MetaResolver

  ssrCleanedUp: boolean = false

  constructor (isSSR: boolean, config: MetaConfig, target: MergedObjectBuilder<MetaSource>, resolver: MetaResolver | ResolveMethod) {
    this.isSSR = isSSR
    this.config = config
    this.target = target

    if (resolver && 'setup' in resolver && isFunction(resolver.setup)) {
      this.resolver = resolver
    }
  }

  static create: CreateMetaManagerMethod = (isSSR, config, resolver) => {
    const resolve: ResolveMethod = (options, contexts, active, key, pathSegments) => {
      if (isFunction(resolver)) {
        return resolver(options, contexts, active, key, pathSegments)
      }

      return resolver.resolve(options, contexts, active, key, pathSegments)
    }

    const active: MetaActive = reactive({})
    const mergedObject = createMergedObject<MetaSource>(resolve, active)

    // TODO: validate resolver
    const manager = new MetaManager(isSSR, config, mergedObject, resolver)
    return manager
  }

  install (app: App): void {
    app.component('Metainfo', Metainfo)

    app.config.globalProperties.$metaManager = this
    app.provide(metaActiveKey, this.target.context.active)
  }

  addMeta (metadata: MetaSource, vm?: ComponentInternalInstance): MetaProxy {
    if (!vm) {
      vm = getCurrentInstance() || undefined
    }

    const metaGuards: MetaGuards = ({
      removed: []
    })

    const resolveContext: MetaResolveContext = { vm }
    const { resolver } = this
    if (resolver && resolver.setup) {
      resolver.setup(resolveContext)
    }

    // TODO: optimize initial compute (once)
    const meta = this.target.addSource(metadata, resolveContext, true)

    const onRemoved = (removeGuard: MetaGuardRemoved) => metaGuards.removed.push(removeGuard)

    const unmount = (ignoreGuards?: boolean) => this.unmount(!!ignoreGuards, meta, metaGuards, vm)

    if (vm) {
      onUnmounted(unmount)
    }

    return {
      meta,
      onRemoved,
      unmount
    }
  }

  private unmount (ignoreGuards: boolean, meta: any, metaGuards: MetaGuards, vm?: ComponentInternalInstance) {
    if (vm) {
      const { $el } = vm.proxy as unknown as ComponentPublicInstance

      // Wait for element to be removed from DOM
      if ($el && $el.offsetParent) {
        let observer: MutationObserver | undefined = new MutationObserver((records) => {
          for (const { removedNodes } of records) {
            if (!removedNodes) {
              continue
            }

            removedNodes.forEach((el) => {
              if (el === $el && observer) {
                observer.disconnect()
                observer = undefined
                this.reallyUnmount(ignoreGuards, meta, metaGuards)
              }
            })
          }
        })

        observer.observe($el.parentNode, { childList: true })
        return
      }
    }

    this.reallyUnmount(ignoreGuards, meta, metaGuards)
  }

  private async reallyUnmount (ignoreGuards: boolean, meta: any, metaGuards: MetaGuards): Promise<void> {
    this.target.delSource(meta)

    if (!ignoreGuards && metaGuards) {
      await Promise.all(metaGuards.removed.map(removeGuard => removeGuard()))
    }
  }

  render ({ slots }: { slots?: Slots } = {}): VNode[] {
    const active = this.target.context.active
    // TODO: clean this method
    const { isSSR } = this

    // cleanup ssr tags if not yet done
    if (!isSSR && !this.ssrCleanedUp) {
      this.ssrCleanedUp = true

      // Listen for DOM loaded because tags in the body couldnt
      // have loaded yet once the manager does it first render
      // (preferable there should only be one meta render on hydration)
      window.addEventListener('DOMContentLoaded', () => {
        const ssrTags = document.querySelectorAll(`[${ssrAttribute}]`)

        if (ssrTags && ssrTags.length) {
          ssrTags.forEach(el => el.parentNode && el.parentNode.removeChild(el))
        }
      }, { once: true })
    }

    const teleports: MetaTeleports = {}

    for (const key in active) {
      const config = this.config[key] || {}

      let renderedNodes = renderMeta(
        { isSSR, metainfo: active, slots },
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
        addVnode(this.isSSR, teleports, to || defaultTo || 'head', vnode)
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
          addVnode(this.isSSR, teleports, tagName, slot({ metainfo: active }))
        }
      }
    }

    return Object.keys(teleports).map((to) => {
      const teleport = teleports[to]
      return h(Teleport, { to }, teleport)
    })
  }
}
