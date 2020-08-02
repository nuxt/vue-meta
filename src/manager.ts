import { App } from 'vue'
import { isFunction } from '@vue/shared'
import { applyMetaPlugin } from './install'
import * as deepestResolver from './resolvers/deepest'
import { Config, ManagerResolverObject, ActiveResolverObject, MetaContext, PathSegments } from './types'

export type Manager = {
  readonly config: Config

  resolver: ManagerResolverObject
  install(app: App): void
}

export function createManager (config: Config, resolver: ActiveResolverObject = deepestResolver): Manager {
  // TODO: validate resolver
  const manager: Manager = {
    resolver: {
      setup (context: MetaContext) {
        if (!resolver || !resolver.setup || isFunction(resolver)) {
          return
        }

        resolver.setup(context)
      },
      resolve (key: string, pathSegments: PathSegments, getShadow, getActive) {
        if (!resolver) {
          return
        }

        if (isFunction(resolver)) {
          return resolver(key, pathSegments, getShadow, getActive)
        }

        return resolver.resolve(key, pathSegments, getShadow, getActive)
      }
    },
    config,
    install (app: App) {
      applyMetaPlugin(app, this)
    }
  }

  return manager
}
