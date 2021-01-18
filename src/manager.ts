import { App, reactive, onUnmounted, ComponentInternalInstance } from 'vue'
import { isFunction } from '@vue/shared'
import { createMergedObject } from './object-merge'
import { applyMetaPlugin } from './install'
// import * as deepestResolver from './resolvers/deepest'
import { Config, Resolver, MetainfoInput, MetaContext, MetaProxy } from './types'
import type { ResolveMethod } from './object-merge'

export type Manager = {
  readonly config: Config

  install(app: App): void
  addMeta(obj: MetainfoInput, vm?: ComponentInternalInstance): MetaProxy
}

export const active = reactive({})

export function createManager (config: Config, resolver: Resolver | ResolveMethod): Manager {
  const resolve: ResolveMethod = (options, contexts, active, key, pathSegments) => {
    if (isFunction(resolver)) {
      return resolver(options, contexts, active, key, pathSegments)
    }

    return resolver.resolve(options, contexts, active, key, pathSegments)
  }

  const { addSource, delSource } = createMergedObject(resolve, active)

  // TODO: validate resolver
  const manager: Manager = {
    config,

    install (app) {
      applyMetaPlugin(app, this, active)
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
    }
  }

  return manager
}
