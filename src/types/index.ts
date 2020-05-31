import { ComponentInternalInstance } from 'vue'
import { Manager } from '../manager'

export type Immutable<T> = {
  readonly [P in keyof T]: Immutable<T[P]>
}

export type TODO = any
export type PathSegments = Array<string>

export interface MetainfoInput {
  [key: string]: TODO
}

export interface MetainfoActive {
  [key: string]: TODO
}

export type MetaContext = {
  id: string | symbol
  vm?: ComponentInternalInstance | null
  manager: Manager
}

export type ActiveResolverSetup = (context: MetaContext) => void
export type ActiveResolverMethod = (
  key: string,
  pathSegments: PathSegments,
  shadow: ShadowNode,
  active: ActiveNode
) => any

export interface ActiveResolverObject {
  setup?: ActiveResolverSetup
  resolve: ActiveResolverMethod
}

export interface ShadowNode {
  [key: string]: TODO
}

export interface ActiveNode {
  [key: string]: TODO
}
