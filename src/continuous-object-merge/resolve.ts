import { hasOwn, isArray } from '@vue/shared'
import { clone } from '../utils'
import { ActiveNode, GetActiveNode, MetaContext, PathSegments, ShadowNode, GetShadowNodes } from '../types'

export function resolveActive (
  context: MetaContext,
  key: string,
  pathSegments: PathSegments,
  shadowParent: ShadowNode,
  activeParent: ActiveNode
) {
  let value

  const isUpdatingArrayKey = isArray(activeParent)

  let shadowLength
  if (isUpdatingArrayKey) {
    shadowLength = shadowParent ? shadowParent.length : 0
  } else {
    shadowLength = shadowParent[key] ? shadowParent[key].length : 0
  }

  if (shadowLength > 1) {
    // Is using freeze useful? Idea is to prevent the user from messing with these options by mistake
    const getShadow: GetShadowNodes = () => Object.freeze(clone(isUpdatingArrayKey ? shadowParent : shadowParent[key]))
    const getActive: GetActiveNode = () => Object.freeze(clone(isUpdatingArrayKey ? activeParent : activeParent[key]))

    value = context.resolve(
      key,
      pathSegments,
      getShadow,
      getActive
    )
  } else if (shadowLength) {
    value = shadowParent[key][0].value
  }

  if (value === undefined) {
    delete activeParent[key]
  } else if (isUpdatingArrayKey) {
    // set new values
    for (const k in value) {
      activeParent[k] = value[k]
    }

    // delete old values
    for (const k in activeParent) {
      if (!(k in value)) {
        delete activeParent[k]
      }
    }
  } else if (!hasOwn(activeParent, key) || activeParent[key] !== value) {
    activeParent[key] = value
  }
}
