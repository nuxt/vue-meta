import { isArray, isPlainObject, /**/ hasOwn } from '@vue/shared'
import { ActiveNode, MetaContext, PathSegments, ShadowNode } from '../types'
import { resolveActive } from './resolve'

export function set (
  context: MetaContext,
  key: string,
  value: any,
  shadowParent?: ShadowNode,
  activeParent?: ActiveNode,
  pathSegments: PathSegments = []
) {
  if (!shadowParent) {
    shadowParent = context.shadow
  }

  if (!activeParent) {
    activeParent = context.active
  }

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

  // Step 1: First find the current data for this key

  // If the activeParent is an array itself, then we are setting the key
  // for an array, so no need to use [key] on the active/shadow parents
  // ie this is to support proxy.myArrayValue[1] = 'value' (instead of proxy.myArrayValue = ['value'])
  if (isArray(activeParent)) {
    idx = shadowParent.findIndex(({ context: shadowContext }: { context: MetaContext }) => shadowContext === context)
  // Check if we already have values from other components
  } else if (!shadowParent[key]) {
    shadowParent[key] = []
  // If we already have values listed, try to find the one for the current context
  } else if (isArray(shadowParent[key])) {
    // check if we already have a value listed for this element for this context
    idx = shadowParent[key].findIndex(({ context: shadowContext }: { context: MetaContext }) => shadowContext === context)
  }

  // Step 2: Set/update the data for this key

  if (isArray(activeParent) && idx < 0) {
    // TODO: what now?
    console.warn('shadowParent not found')

  // Change the array/key element in the shadowParent
  } else if (isArray(activeParent)) {
    if (value === undefined) {
      shadowParent[idx].value.splice(key, 1)
    } else {
      shadowParent[idx].value[key] = value
    }
  // if this context/key combo exists but value is undefined, remove it
  } else if (idx > -1 && value === undefined) {
    shadowParent[key].splice(idx, 1)
    // overwrite current value for context/key combo
  } else if (idx > -1) {
    shadowParent[key][idx].value = value

    // new context/key combo so just add value
  } else if (idx === -1 && value) {
    shadowParent[key].push({ context, value })
  } else if (value === undefined) {
    delete shadowParent[key]
  }

  // Step 3: Update the active data
  resolveActive(context, key, pathSegments, shadowParent, activeParent)
}

export function setByObject (
  context: MetaContext,
  value: any,
  shadowParent? : ShadowNode,
  activeParent?: ActiveNode,
  pathSegments: PathSegments = []
) {
  if (!shadowParent) {
    shadowParent = context.shadow
  }

  if (!activeParent) {
    activeParent = context.active
  }

  // cleanup properties that no longer exists
  for (const key in shadowParent) {
    if (hasOwn(value, key)) {
      continue
    }

    if (isPlainObject(shadowParent[key])) {
      setByObject(context, {}, shadowParent[key], activeParent[key], [
        ...pathSegments,
        key
      ])
      continue
    } /**/

    set(context, key, undefined, shadowParent, activeParent, [
      ...pathSegments,
      key
    ])
  }

  // set new values
  for (const key in value) {
    set(context, key, value[key], shadowParent, activeParent, [
      ...pathSegments,
      key
    ])
  }
}
