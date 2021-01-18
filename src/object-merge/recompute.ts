import { isArray, isObject, isPlainObject } from '@vue/shared'
import { clone, pluck } from '../utils'
import { RESOLVE_CONTEXT } from './constants'
import type { MergeContext, MergeSource, MergedObject, PathSegments, ResolveContext } from '.'

export const allKeys = (source?: MergeSource, ...sources: Array<MergeSource>): Array<string> => {
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

export const recompute = (context: MergeContext, sources?: Array<MergeSource>, target?: MergedObject, path: PathSegments = []): void => {
  if (!path.length) {
    if (!target) {
      target = context.active
    }

    if (!sources) {
      sources = context.sources
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
    if (isPlainObject(sources[0][key])) {
      if (!target[key]) {
        target[key] = {}
      }

      const keySources = []
      for (const source of sources) {
        if (key in source) {
          keySources.push(source[key])
        }
      }

      recompute(context, keySources, target[key], [...path, key])
      continue
    }

    // Ensure the target is an array if source is an array and target is empty
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

    // console.log('RESOLVED', key, resolved, 'was', target[key])
    target[key] = resolved
  }
}
