import { MetaContext, PathSegments, ShadowNode, ActiveNode } from '../types'
import { set } from './set'

export function update (
  context: MetaContext,
  pathSegments: PathSegments,
  key: string,
  value: any
) {
  const { active, shadow } = context

  let activeParent: ActiveNode = active
  let shadowParent: ShadowNode = shadow

  for (const segment of pathSegments) {
    activeParent = activeParent[segment]
    shadowParent = shadowParent[segment]
  }

  set(context, key, value, shadowParent, activeParent)
}
