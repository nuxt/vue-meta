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

    // We dont care about nested objects here , these changes
    // should already have been tracked by the MergeProxy
    if (isObject(target[key])) {
      continue
    }

    if (newSource[key] !== oldSource[key]) {
      target[key] = newSource[key]
    }
  }

  for (const key in oldSource) {
    if (!(key in newSource)) {
      delete target[key]
    }
  }
}
