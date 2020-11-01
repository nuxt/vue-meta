import { App, markRaw, reactive, onUnmounted, ComponentInternalInstance } from 'vue'
import { isFunction } from '@vue/shared'
import { createProxy, createHandler, setByObject, remove } from './continuous-object-merge'
import { PolySymbol } from './symbols'
import { applyMetaPlugin } from './install'
// import * as deepestResolver from './resolvers/deepest'
import { Config, ActiveResolverObject, ActiveResolverMethod, MetaContext, MetainfoInput, MetaProxy } from './types'

let contextCounter: number = 0

export type Manager = {
  readonly config: Config

  install(app: App): void
  createMetaProxy(obj: MetainfoInput, vm?: ComponentInternalInstance): MetaProxy
}

export const shadow = markRaw({})
export const active = reactive({})

export function createManager (config: Config, resolver: ActiveResolverObject): Manager {
  const resolve: ActiveResolverMethod = (key, pathSegments, getShadow, getActive) => {
    if (!resolver) {
      return
    }

    if (isFunction(resolver)) {
      return resolver(key, pathSegments, getShadow, getActive)
    }

    return resolver.resolve(key, pathSegments, getShadow, getActive)
  }

  // TODO: validate resolver
  const manager: Manager = {
    config,

    install (app) {
      applyMetaPlugin(app, this, active)
    },

    createMetaProxy (obj, vm) {
      const context: MetaContext = {
        id: PolySymbol(`ctx${contextCounter++}`),
        vm: vm || undefined,
        resolve,
        shadow,
        active
      }

      const unmount = <T extends Function = () => any>() => remove(context)
      if (vm) {
        onUnmounted(unmount)
      }

      if (resolver && resolver.setup && isFunction(resolver)) {
        resolver.setup(context)
      }

      setByObject(context, obj)

      const handler = /* #__PURE__ */ createHandler(context)
      const meta = createProxy(obj, handler)

      return {
        meta,
        unmount
      }
    }
  }

  return manager
}
