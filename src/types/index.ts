import type { App, VNode, Slots, ComponentInternalInstance } from 'vue'
import type { MergedObject, ResolveContext, ResolveMethod } from '../object-merge'
import type { MetaConfig } from './config'

export * from './config'

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

/**
 * Return value of the useMeta api
 */
export type MetaProxy = {
  meta: MetaSourceProxy
  unmount: Function | false
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
  vm: ComponentInternalInstance | undefined
}

export type MetaResolveSetup = (context: MetaResolveContext) => void

export type MetaResolver = {
  setup?: MetaResolveSetup
  resolve: ResolveMethod
}

/**
 * The meta manager
 */
export type MetaManager = {
  readonly config: MetaConfig

  install(app: App): void
  addMeta(source: MetaSource, vm?: ComponentInternalInstance): MetaProxy

  render(ctx?: { slots?: Slots }): Array<VNode>
}

/**
 * @internal
 */
export type MetaTeleports = {
  [key: string]: Array<VNode>
}

/**
 * @internal
 */
export interface MetaRenderContext {
  slots?: Slots
  metainfo: MetaActive
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
  }
}
