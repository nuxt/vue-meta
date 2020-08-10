import { ComponentInternalInstance } from 'vue'
import { Manager } from '../manager'

export type Immutable<T> = {
  readonly [P in keyof T]: Immutable<T[P]>
}

export type TODO = any
export type PathSegments = Array<string>

export interface ConfigOption {
  tag?: string
  to?: string
  group?: boolean
  keyAttribute?: string
  valueAttribute?: string
  nameless?: boolean
  namespaced?: boolean
  namespacedAttribute?: boolean
  attributesFor?: string
}

export interface Config {
  [key: string]: ConfigOption
}

export interface MetainfoInput {
  [key: string]: TODO
}

export interface MetainfoActive {
  [key: string]: TODO
}

export type MetaContext = {
  id: string | symbol
  vm?: ComponentInternalInstance
  manager: Manager
}

export type ActiveResolverSetup = (context: MetaContext) => void
export type ActiveResolverMethod = (
  key: string,
  pathSegments: PathSegments,
  shadow: GetShadowNodes,
  active: GetActiveNode
) => any

export interface ActiveResolverObject {
  setup?: ActiveResolverSetup
  resolve: ActiveResolverMethod
}

export interface ManagerResolverObject {
  setup: ActiveResolverSetup
  resolve: ActiveResolverMethod
}

export interface ShadowNode {
  [key: string]: TODO
}

export interface ActiveNode {
  [key: string]: TODO
}

export interface GetShadowNodes {
  (): Array<ShadowNode>
}

export interface GetActiveNode {
  (): ActiveNode
}
