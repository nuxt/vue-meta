import { IS_PROXY, PROXY_SOURCES, PROXY_TARGET, RESOLVE_CONTEXT } from './constants'
import { createProxy } from './proxy'
import { recompute } from './recompute'

export interface ResolveContext {}

export type MergeSource<T extends Object> = { [K in keyof T]: T[K] } & {
  [IS_PROXY]: boolean
  [PROXY_SOURCES]: MergeSource<T>[]
  [PROXY_TARGET]: MergeSource<T>
  [RESOLVE_CONTEXT]: ResolveContext
}

// eslint-disable-next-line no-use-before-define
export type MergedObjectValue = boolean | number | string | MergedObject | any

export type MergedObject = {
  [key: string]: MergedObjectValue
}

export type PathSegments = Array<string>

export interface ResolveMethod<T = any, U = ResolveContext> {
  (
    options: Array<T>,
    contexts: Array<U>,
    active: MergedObjectValue,
    key: string | number | symbol,
    pathSegments: PathSegments,
  ): MergedObjectValue
}

export type MergeContext<T> = {
  resolve: ResolveMethod
  active: MergedObject
  sources: MergeSource<T>[]
}

export type MergedObjectBuilder<T> = {
  context: MergeContext<T>
  compute: () => void
  addSource: (source: T, resolveContext?: ResolveContext, recompute?: Boolean) => any
  delSource: (sourceOrProxy: T | MergeSource<T>, recompute?: boolean) => boolean
}

export const createMergedObject = <T extends Object>(resolve: ResolveMethod<T>, active: T): MergedObjectBuilder<T> => {
  const sources: MergeSource<T>[] = []

  const context: MergeContext<T> = {
    active,
    resolve,
    sources
  }

  const compute: () => void = () => recompute<T>(context)

  return {
    context,
    compute,
    addSource: (source, resolveContext, recompute = false) => {
      const proxy = createProxy<T>(context, source, resolveContext || {})

      if (recompute) {
        compute()
      }

      return proxy
    },
    delSource: (sourceOrProxy, recompute = true) => {
      const index = sources.findIndex(source => source === sourceOrProxy || source[PROXY_TARGET] === sourceOrProxy)

      if (index > -1) {
        sources.splice(index, 1)

        if (recompute) {
          compute()
        }

        return true
      }

      return false
    }
  }
}
