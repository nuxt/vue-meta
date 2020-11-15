import { markRaw } from 'vue'
import { isObject } from '@vue/shared'
import { MetaContext, MetainfoInput, MetainfoProxy, PathSegments } from '../types'
import { update } from './update'
import { remove } from './remove'

export function createProxy (target: MetainfoInput, handler: ProxyHandler<object>): MetainfoProxy {
  return markRaw(new Proxy(target, handler))
}

export function createHandler (context: MetaContext, pathSegments: PathSegments = []): ProxyHandler<object> {
  return {
    get (target: object, key: string, receiver: object) {
      const value = Reflect.get(target, key, receiver)

      if (!isObject(value) || key === '__vm_proxy') {
        return value
      }

      if (!value.__vm_proxy) {
        const keyPath: PathSegments = [...pathSegments, key]

        const handler = /* #__PURE__ */ createHandler(context, keyPath)
        Object.defineProperty(
          value,
          '__vm_proxy',
          {
            configurable: false,
            enumerable: false,
            writable: false,
            value: createProxy(value, handler)
          }
        )
      }

      return value.__vm_proxy
    },
    set (
      target: { [key: string]: any }, // eslint-disable-line @typescript-eslint/no-unused-vars
      key: string,
      value: any
    ): boolean {
      const success = Reflect.set(target, key, value)

      if (success) {
        update(context, pathSegments, key, value)
      }

      return success
    },
    deleteProperty (
      target: { [key: string]: any },
      prop: string
    ) {
      const success = Reflect.deleteProperty(target, prop)

      if (success) {
        remove(context, pathSegments, prop)
      }

      return success
    }
  }
}
