import { isArray, isObject, isPlainObject } from '@vue/shared'
import { clone, pluck } from '../utils'
import { RESOLVE_CONTEXT } from './constants'
import type { MergeContext, MergeSource, MergedObject, PathSegments, ResolveContext } from '.'

export const allKeys = <T>(source?: MergeSource<T>, ...sources: MergeSource<T>[]): string[] => {
  const keys = source ? Object.keys(source) : []

  if (sources) {
    for (const source of sources) {
      if (!source || !isObject(source)) {
        continue
      }

      for (const key in source) {
        if (!keys.includes(key)) {
          keys.push(key)
        }
      }
    }
  }

  // TODO: add check for consistent types for each key (dev only)

  return keys
}

export const recompute = <T>(context: MergeContext<T>, path: PathSegments = [], target?: MergedObject, sources?: MergeSource<T>[]): void => {
  const setTargetAndSources = !target && !sources
  if (setTargetAndSources) {
    ({ active: target, sources } = context)

    if (path.length) {
      for (let i = 0; i < path.length; i++) {
        const seg = path[i]

        if (!target || !target[seg]) {
          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.error(`recompute: segment ${seg} not found on target`, path, target)
          }
          return
        }

        target = target[seg]

        sources = sources.map(source => (source as Record<string, any>)[seg]).filter(Boolean)
      }
    }
  }

  if (!target || !sources) {
    return
  }

  const keys = allKeys(...sources)

  // Clean up properties that dont exists anymore
  const targetKeys = Object.keys(target)
  for (const key of targetKeys) {
    if (!keys.includes(key)) {
      delete target[key]
    }
  }

  for (const key of keys) {
    // This assumes consistent types usages for keys across sources
    // @ts-ignore
    let isObject = false
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i] as Record<string, any>

      if (source && key in source && source[key] !== undefined) {
        isObject = isPlainObject(source[key])
        break
      }
    }

    if (isObject) {
      if (!target[key]) {
        target[key] = {}
      }

      const keySources = []
      for (const source of sources) {
        if (key in source) {
          // @ts-ignore
          keySources.push(source[key])
        }
      }

      recompute(context, [...path, key], target[key], keySources)
      continue
    }

    // Ensure the target is an array if source is an array and target is empty
    // @ts-ignore
    if (!target[key] && isArray(sources[0][key])) {
      target[key] = []
    }

    const keyContexts: Array<ResolveContext> = []
    const keySources = pluck(sources, key, source => keyContexts.push(source[RESOLVE_CONTEXT]))

    let resolved = context.resolve(
      keySources,
      keyContexts,
      target[key],
      key,
      path
    )

    if (isPlainObject(resolved)) {
      resolved = clone(resolved)
    }

    target[key] = resolved
  }
}
