import { markRaw } from 'vue'
import { isObject } from '@vue/shared'
import { update } from './info/update'
import { MetaContext, MetainfoInput, PathSegments } from './types'

interface Target extends MetainfoInput {
  __vm_proxy?: any
}

export function createProxy(
  target: Target,
  handler: ProxyHandler<object>
): Target {
  return markRaw(new Proxy(target, handler))
}

export function createHandler(
  context: MetaContext,
  pathSegments: PathSegments = []
): ProxyHandler<object> {
  return {
    get(target: object, key: string, receiver: object) {
      const value = Reflect.get(target, key, receiver)

      if (!isObject(value)) {
        return value
      }

      if (!value.__vm_proxy) {
        const keyPath: PathSegments = [...pathSegments, key]

        const handler = /*#__PURE__*/ createHandler(context, keyPath)
        value.__vm_proxy = createProxy(value, handler)
      }

      return value.__vm_proxy
    },
    set(
      target: object,
      key: string,
      value: unknown,
      receiver: object
    ): boolean {
      update(context, pathSegments, key, value)
      return true
    },
  }
}
