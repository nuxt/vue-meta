import { markRaw } from 'vue'
import { isArray, isObject, isPlainObject } from '@vue/shared'
import { clone, pluck } from '../utils'
import { IS_PROXY, PROXY_SOURCES, PROXY_TARGET, RESOLVE_CONTEXT } from './constants'
import { recompute } from './recompute'
import type { MergeContext, MergeSource, MergedObjectValue, PathSegments, ResolveContext } from '.'

export const createProxy = (context: MergeContext, target: MergeSource, resolveContext: ResolveContext, pathSegments: PathSegments = []) => {
  const handler = createHandler(context, resolveContext, pathSegments)
  const proxy = markRaw(new Proxy(target, handler))

  if (!pathSegments.length && context.sources) {
    context.sources.push(proxy)
  }

  return proxy
}

export const createHandler: (context: MergeContext, resolveContext: ResolveContext, pathSegments: PathSegments) => ProxyHandler<any> = (context, resolveContext, pathSegments = []) => ({
  get: (target, key, receiver) => {
    if (key === IS_PROXY) {
      return true
    }

    if (key === PROXY_SOURCES) {
      return context.sources
    }

    if (key === PROXY_TARGET) {
      return target
    }

    if (key === RESOLVE_CONTEXT) {
      return resolveContext
    }

    let value = Reflect.get(target, key, receiver)

    if (!isObject(value)) {
      return value
    }

    if (!value[IS_PROXY]) {
      const keyPath: PathSegments = [...pathSegments, (key as string)]

      value = createProxy(context, value, resolveContext, keyPath)
      target[key] = value
    }

    return value
  },
  set: (target, key, value) => {
    const success = Reflect.set(target, key, value)
    console.warn(success, 'PROXY SET\nkey:', key, '\npath:', pathSegments, '\ntarget:', isArray(target), target, '\ncontext:\n', context)

    if (success) {
      const isArrayItem = isArray(target)
      let hasArrayParent = false

      let { sources: proxies, active } = context
      let activeSegmentKey

      let index = 0
      for (const segment of pathSegments) {
        proxies = pluck(proxies, segment)

        if (isArrayItem && index === pathSegments.length - 1) {
          activeSegmentKey = segment
          break
        }

        if (isArray(active)) {
          hasArrayParent = true
        }

        active = active[segment]
        index++
      }

      if (hasArrayParent) {
        // TODO: fix that we dont have to recompute the full merged object
        // we should only have to recompute the branch that has changed
        // but there is an issue here with supporting both arrays of strings
        // as collections (parent vs parent of parent we need to trigger the
        // update from)
        recompute(context)
        return success
      }

      let keyContexts: Array<ResolveContext> = []
      let keySources

      if (isArrayItem) {
        keySources = proxies
        keyContexts = proxies.map(proxy => proxy[RESOLVE_CONTEXT])
      } else {
        keySources = pluck(proxies, key as string, proxy => keyContexts.push(proxy[RESOLVE_CONTEXT]))
      }

      let resolved = context.resolve(
        keySources,
        keyContexts,
        active,
        key,
        pathSegments
      )

      // Ensure to clone if value is an object, cause sources is an array of
      // the sourceProxies not the sources so we could trigger an endless loop when
      // updating a prop on an obj as the prop on the active object refers to
      // a prop on a proxy
      if (isPlainObject(resolved)) {
        resolved = clone(resolved)
      }

      console.log('SET VALUE', isArrayItem, key, '\nresolved:\n', resolved, '\nsources:\n', context.sources, '\nactive:\n', active, Object.keys(active))

      if (isArrayItem && activeSegmentKey) {
        active[activeSegmentKey] = resolved
      } else {
        active[(key as string)] = resolved
      }
    }

    console.log('CONTEXT.ACTIVE', context.active, '\nparent:\n', target)
    return success
  },
  deleteProperty: (target, key) => {
    const success = Reflect.deleteProperty(target, key)
    console.warn('PROXY DELETE\nkey:', key, '\npath:', pathSegments, '\nparent:', isArray(target), target)

    if (success) {
      const isArrayItem = isArray(target)
      let activeSegmentKey

      let proxies = context.sources
      let active: MergedObjectValue = context.active as MergedObjectValue

      let index = 0
      for (const segment of pathSegments) {
        proxies = proxies.map(proxy => proxy[segment])

        if (isArrayItem && index === pathSegments.length - 1) {
          activeSegmentKey = segment
          break
        }

        active = active[segment]
        index++
      }

      // Check if the key still exists in one of the sourceProxies,
      // if so resolve the new value, if not remove the key
      if (proxies.some(proxy => (key in proxy))) {
        let keyContexts: Array<ResolveContext> = []
        let keySources

        if (isArrayItem) {
          keySources = proxies
          keyContexts = proxies.map(proxy => proxy[RESOLVE_CONTEXT])
        } else {
          keySources = pluck(proxies, key as string, proxy => keyContexts.push(proxy[RESOLVE_CONTEXT]))
        }

        let resolved = context.resolve(
          keySources,
          keyContexts,
          active,
          key,
          pathSegments
        )

        if (isPlainObject(resolved)) {
          resolved = clone(resolved)
        }

        console.log('SET VALUE', resolved)
        if (isArrayItem && activeSegmentKey) {
          active[activeSegmentKey] = resolved
        } else {
          active[(key as string)] = resolved
        }
      } else {
        delete active[key]
      }
    }

    return success
  }
})
