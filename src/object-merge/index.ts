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

export type ResolveMethod = (
  options: Array<any>,
  contexts: Array<ResolveContext>,
  active: MergedObjectValue,
  key: string | number | symbol,
  pathSegments: PathSegments,
) => MergedObjectValue

export type MergeContext = {
  resolve: ResolveMethod
  active: MergedObject
  sources: Array<MergeSource>
}

export const createMergedObject = (resolve: ResolveMethod, active: MergedObject = {}) => {
  const sources: Array<MergeSource> = []

  if (!active) {
    active = {}
  }

  const context: MergeContext = {
    active,
    resolve,
    sources
  }

  const compute = () => recompute(context)

  const addSource = (source: MergeSource, resolveContext: ResolveContext | undefined, recompute: Boolean = false) => {
    const proxy = createProxy(context, source, resolveContext || {})

    if (recompute) {
      compute()
    }

    return proxy
  }

  const delSource = (sourceOrProxy: MergeSource, recompute: boolean = true): boolean => {
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

  return {
    context,
    active,
    resolve,
    sources,
    addSource,
    delSource,
    compute
  }
}
