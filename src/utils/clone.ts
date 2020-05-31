import { isArray, isObject } from '@vue/shared'
// See: https://github.com/vuejs/vue-next/blob/08b4e8815da4e8911058ccbab986bea6365c3352/packages/compiler-ssr/src/transforms/ssrTransformComponent.ts

export function clone(v: any): any {
  if (isArray(v)) {
    return v.map(clone)
  }

  if (isObject(v)) {
    const res: any = {}

    for (const key in v) {
      if (key === 'context') {
        res[key] = v[key]
      } else {
        res[key] = clone(v[key])
      }
    }
    return res
  }

  return v
}
