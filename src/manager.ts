import { App } from 'vue'
import { isFunction } from '@vue/shared'
import { defaultMapping } from './config'
import { applyMetaPlugin } from './install'
import * as deepestResolver from './resolvers/deepest'
import { TODO, ActiveResolverObject, MetaContext, PathSegments } from './types'

export type ManagerOptions = {
  install(app: App): void
}

export type Manager = {
  readonly config: TODO

  resolver: ActiveResolverObject
  install(app: App): void
}

export function createManager(options: TODO = {}): Manager {
  const { resolver = deepestResolver } = options

  // TODO: validate resolver

  const manager: Manager = {
    resolver: {
      setup(context: MetaContext) {
        if (!resolver || isFunction(resolver)) {
          return
        }

        resolver.setup(context)
      },
      resolve(key: string, pathSegments: PathSegments, getShadow, getActive) {
        if (!resolver) {
          return
        }

        if (isFunction(resolver)) {
          return resolver(key, pathSegments, getShadow, getActive)
        }

        return resolver.resolve(key, pathSegments, getShadow, getActive)
      },
    },
    config: {
      ...defaultMapping,
      ...options.config,
    },
    install(app: App) {
      applyMetaPlugin(app, this)
    },
  }

  return manager
}
