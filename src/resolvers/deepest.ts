import {
  ActiveNode,
  /* ActiveResolverSetup, ActiveResolverMethod, */ MetaContext,
  PathSegments,
  ShadowNode
} from '../types'

export function setup (context: MetaContext): void {}

export function resolve (
  key: string,
  pathSegments: PathSegments,
  shadow: ShadowNode,
  active: ActiveNode
): any {}
