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

  if (shadowParent[key].length > 1) {
    // Is using freeze useful? Idea is to prevent the user from messing with these options by mistake
    const getShadow: GetShadowNodes = () => Object.freeze(clone(shadowParent[key]))
    const getActive: GetActiveNode = () => Object.freeze(clone(activeParent[key]))

    value = context.manager.resolver.resolve(
      key,
      pathSegments,
      getShadow,
      getActive
    )
  } else if (shadowParent[key].length) {
    value = shadowParent[key][0].value
  }

  if (value === undefined) {
    delete activeParent[key]
  } else if (!hasOwn(activeParent, key) || activeParent[key] !== value) {
    activeParent[key] = value
  }
}
