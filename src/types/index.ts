import type { App, VNode, ComponentInternalInstance } from 'vue'
import type { MergedObject, ResolveContext, ResolveMethod } from '../object-merge'

export type TODO = any

export type MetainfoInput = {
  [key: string]: TODO
}

export type MetaContext = ResolveContext & {
  vm: ComponentInternalInstance | undefined
}

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

export interface MetainfoProxy extends MergedObject {

}

export interface MetainfoActive {
  [key: string]: TODO
}

export type MetaProxy = {
  meta: MetainfoProxy
  unmount: TODO
}

export type ResolveSetup = (context: MetaContext) => void

export type Resolver = {
  setup?: ResolveSetup
  resolve: ResolveMethod
}

export type Manager = {
  readonly config: Config

  install(app: App): void
  addMeta(obj: MetainfoInput, vm?: ComponentInternalInstance): MetaProxy

  render(ctx: { slots?: any }): Array<VNode>
}

declare module '@vue/runtime-core' {
  interface ComponentInternalInstance {
    $metaManager: Manager
  }
}

declare global {
  namespace NodeJS {
    interface Process {
      client: boolean
      server: boolean
    }
  }
}
