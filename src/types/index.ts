import type { VNode, Slots, ComponentInternalInstance } from 'vue'
import type { MergedObject, ResolveContext, ResolveMethod } from '../object-merge'
import type { MetaManager } from '../manager'

export * from './config'

export type Modify<T, R> = Omit<T, keyof R> & R;

export type Truthy<T> = T extends undefined | void | null | false | 0 | '' ? never : T
export type ExcludesFalsy = <T>(x: T) => x is Truthy<T>

export type TODO = any

/**
 * Proxied meta source for tracking changes and updating the active meta daa
 */
export interface MetaSourceProxy extends MergedObject {}

/**
 * Metainfo data source input by the user through the useMeta fn
 */
export type MetaSource = {
  [key: string]: TODO
}

export type MetaGuardRemoved = () => void | Promise<void>

/**
 * Return value of the useMeta api
 */
export type MetaProxy = {
  meta: MetaSourceProxy
  onRemoved: (removeGuard: MetaGuardRemoved) => void
  unmount: (ignoreGuards?: boolean) => void
}

/**
 * The active/aggregated meta data currently rendered
 */
export interface MetaActive {
  [key: string]: TODO
}

/**
 * Context passed to the meta resolvers
 */
export type MetaResolveContext = ResolveContext & {
  vm?: ComponentInternalInstance
}

export type MetaResolveSetup = (context: MetaResolveContext) => void

export type MetaResolver = {
  setup?: MetaResolveSetup
  resolve: ResolveMethod
}

export type MetaResolverSetup = Required<MetaResolver>

/**
 * @internal
 */
export type MetaTeleports = {
  [key: string]: Array<VNode>
}

/**
 * @internal
 */
export interface MetaGuards {
  removed: Array<MetaGuardRemoved>
}

/**
 * @internal
 */
export interface MetaRenderContext {
  isSSR: boolean
  metainfo: MetaActive
  slots?: Slots
}

/**
 * @internal
 */
export interface MetaGroupConfig {
  group: string
  data: Array<TODO> | TODO
  tagNamespace?: string
  fullName?: string
  slotName?: string
}

/**
 * @internal
 */
export interface SlotScopeProperties {
  content: string
  metainfo: MetaActive
  [key: string]: any
}

/**
 * @internal
 */
export type MetaRenderedNode = {
  vnode: VNode
  to?: string
}

/**
 * @internal
 */
export type MetaRendered = Array<MetaRenderedNode>

declare module '@vue/runtime-core' {
  interface ComponentInternalInstance {
    $metaManager: MetaManager
    $metaGuards: MetaGuards
  }
}
