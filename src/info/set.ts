import { isPlainObject, hasOwn } from '@vue/shared'
import { shadow, active } from './globals'
import { resolveActive } from './resolve'
import { ActiveNode, MetaContext, PathSegments, ShadowNode } from '../types'

export function set(
  context: MetaContext,
  key: string,
  value: any,
  shadowParent: ShadowNode = shadow,
  activeParent: ActiveNode = active,
  pathSegments: PathSegments = []
) {
  if (isPlainObject(value)) {
    // shadow & active should always be in sync
    // if not we have bigger fish to fry
    if (!shadowParent[key]) {
      shadowParent[key] = {}
      activeParent[key] = {}
    }

    return setByObject(
      context,
      value,
      shadowParent[key],
      activeParent[key],
      pathSegments
    )
  }

  let idx = -1
  if (!shadowParent[key]) {
    shadowParent[key] = []
  } else {
    // check if we already have a value listed for this element for this context
    idx = shadowParent[key].findIndex(
      ({ context: $context }: { context: MetaContext }) => $context === context
    )
  }

  // if this context/key combo exists but value is undefined, remove it
  if (idx > -1 && value === undefined) {
    shadowParent[key].splice(idx, 1)

    // overwrite current value for context/key combo
  } else if (idx > -1) {
    shadowParent[key][idx].value = value

    // new context/key combo so just add value
  } else if (value) {
    shadowParent[key].push({ context, value })
  }

  resolveActive(context, key, pathSegments, shadowParent, activeParent)
}

export function setByObject(
  context: MetaContext,
  value: any,
  shadowParent: ShadowNode = shadow,
  activeParent: ActiveNode = active,
  pathSegments: PathSegments = []
) {
  // cleanup properties that no longer exists
  for (const key in shadowParent) {
    if (hasOwn(value, key)) {
      continue
    }

    if (isPlainObject(shadowParent[key])) {
      setByObject(context, {}, shadowParent[key], activeParent[key], [
        ...pathSegments,
        key,
      ])
      continue
    }

    set(context, key, undefined, shadowParent, activeParent, [
      ...pathSegments,
      key,
    ])
  }

  // set new values
  for (const key in value) {
    set(context, key, value[key], shadowParent, activeParent, [
      ...pathSegments,
      key,
    ])
  }
}
