import { isObject } from '@vue/shared'

type AnyObject = { [key: string] : any }

/**
 * Apply the differences between newSource & oldSource to target
 */
export function applyDifference (target: AnyObject, newSource: AnyObject, oldSource: AnyObject) {
  for (const key in newSource) {
    if (!(key in oldSource)) {
      target[key] = newSource[key]
      continue
    }

    if (isObject(target[key])) {
      applyDifference(target[key], newSource[key], oldSource[key])
      continue
    }

    if (newSource[key] !== oldSource[key]) {
      target[key] = newSource[key]
    }
  }

  for (const key in oldSource) {
    if (!newSource || !(key in newSource)) {
      delete target[key]
    }
  }
}
