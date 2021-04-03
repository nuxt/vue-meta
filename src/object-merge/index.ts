import { PROXY_TARGET } from './constants'
import { createProxy } from './proxy'
import { recompute } from './recompute'

export type MergeSource = {
  [key: string]: any
}

// eslint-disable-next-line no-use-before-define
export type MergedObjectValue = boolean | number | string | MergedObject | any

export type MergedObject = {
  [key: string]: MergedObjectValue
}

export type PathSegments = Array<string>

export type ResolveContext = {}

export type ResolveMethod<T = ResolveContext> = (
  options: Array<any>,
  contexts: Array<T>,
  active: MergedObjectValue,
  key: string | number | symbol,
  pathSegments: PathSegments,
) => MergedObjectValue

export type MergeContext = {
  resolve: ResolveMethod
  active: MergedObject
  sources: Array<MergeSource>
}

export type MergedObjectBuilder = {
  context: MergeContext
  compute: () => void
  addSource: (source: MergeSource, resolveContext: ResolveContext | undefined, recompute?: Boolean) => any
  delSource: (sourceOrProxy: MergeSource, recompute?: boolean) => boolean
}

export const createMergedObject = (resolve: ResolveMethod, active: MergedObject = {}): MergedObjectBuilder => {
  const sources: Array<MergeSource> = []

  if (!active) {
    active = {}
  }

  const context: MergeContext = {
    active,
    resolve,
    sources
  }

  const compute: () => void = () => recompute(context)

  return {
    context,
    compute,
    addSource: (source, resolveContext, recompute = false) => {
      const proxy = createProxy(context, source, resolveContext || {})

      if (recompute) {
        compute()
      }

      return proxy
    },
    delSource: (sourceOrProxy, recompute = true) => {
      const index = sources.findIndex(src => src === sourceOrProxy || src[PROXY_TARGET] === sourceOrProxy)

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
