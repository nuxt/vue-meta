import './vue';
import Vue, { ComponentOptions, PluginFunction, PluginObject } from 'vue';

type Component = ComponentOptions<Vue> | typeof Vue;
type elements = HTMLElement[]

export interface VueMetaOptions {
  keyName: string, // the component option name that vue-meta looks for meta info on.
  attribute: string, // the attribute name vue-meta adds to the tags it observes
  ssrAttribute: string, // the attribute name that lets vue-meta know that meta info has already been server-rendered
  tagIDKeyName: string // the property name that vue-meta uses to determine whether to overwrite or append a tag
  refreshOnceOnNavigation: boolean
}

export declare class VueMeta {
  static version: string
  static install(vue: typeof Vue, options?: VueMetaOptions): PluginFunction<never>
  static hasMetaInfo(vm: Component): boolean
}

interface refreshed {
  vm: Component,
  metaInfo: MetaInfo,
  tags: {
    addedTags: elements
    removedTags: elements
  }
}

export interface $meta {
  getOptions(): VueMetaOptions
  refresh(): refreshed
  inject(): MetaInfoSSR
  pause(refresh: true): () => refreshed
  pause(refresh?: boolean): () => void
  resume(refresh: true): refreshed
  resume(refresh?: boolean): void
}

export interface MetaInfo {
  title?: string
  titleTemplate?: string | ((titleChunk: string) => string)
  htmlAttrs?: { [key: string]: string | string[] }
  headAttrs?: { [key: string]: string | string[] }
  bodyAttrs?: { [key: string]: string | string[] }
  base?: { target: string, href: string }

  meta?: {
    vmid?: string,
    charset?: string,
    content?: string,
    'http-equiv'?: 'content-security-policy' | 'refresh',
    name?: string,
      [key: string]: any
  }[]

  link?: { rel: string, href: string, [key: string]: any }[]
  style?: { cssText: string, type: string, [key: string]: any }[]
  script?: { innerHTML?: string, src?: string, type: string, [key: string]: any }[]
  noscript?: { innerHTML: string, [key: string]: any }[]

  __dangerouslyDisableSanitizers?: string[]
  __dangerouslyDisableSanitizersByTagID?: {
    [vmid: string]: string[]
  }

  changed?: <T extends MetaInfo>(newInfo: T, addedTags: elements, removedTags: elements) => void
  afterNavigation?: <T extends MetaInfo>(newInfo: T) => void
}

interface toText {
  text(): string
}

interface toBodyTextOption {
  body: boolean
}
interface toBodyText {
  text(options?: toBodyTextOption): string
}

export interface MetaInfoSSR {
  title?: toText
  htmlAttrs?: toText
  headAttrs?: toText
  bodyAttrs?: toText
  base?: toText
  meta?: toText
  link?: toText
  style?: toText
  script?: toBodyText
  noscript?: toBodyText
}
