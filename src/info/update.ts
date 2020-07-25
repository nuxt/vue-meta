import { MetaContext, PathSegments, ShadowNode, ActiveNode } from '../types'
import { shadow, active } from './globals'
import { set } from './set'

export function update (
  context: MetaContext,
  pathSegments: PathSegments,
  key: string,
  value: any
) {
  let shadowParent: ShadowNode = shadow
  let activeParent: ActiveNode = active

  for (const segment of pathSegments) {
    shadowParent = shadowParent[segment]
    activeParent = activeParent[segment]
  }

  set(context, key, value, shadowParent, activeParent)
}
