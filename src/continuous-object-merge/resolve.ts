import { hasOwn } from '@vue/shared'
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

  const shadowLength = shadowParent[key] ? shadowParent[key].length : 0

  if (shadowLength > 1) {
    // Is using freeze useful? Idea is to prevent the user from messing with these options by mistake
    const getShadow: GetShadowNodes = () => Object.freeze(clone(shadowParent[key]))
    const getActive: GetActiveNode = () => Object.freeze(clone(activeParent[key]))

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
  } else if (!hasOwn(activeParent, key) || activeParent[key] !== value) {
    activeParent[key] = value
  }
}
