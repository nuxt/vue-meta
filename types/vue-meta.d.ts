import './vue'
import Vue, { ComponentOptions, PluginFunction, PluginObject } from 'vue'

type Component = ComponentOptions<Vue> | typeof Vue
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

interface Refreshed {
  vm: Component,
  metaInfo: MetaInfo,
  tags: {
    addedTags: elements
    removedTags: elements
  }
}

export interface VueMetaPlugin {
  getOptions(): VueMetaOptions
  refresh(): Refreshed
  inject(): MetaInfoSSR
  pause(refresh: true): () => Refreshed
  pause(refresh?: boolean): () => void
  resume(refresh: true): Refreshed
  resume(refresh?: boolean): void
}

export interface AttributeProperty {
  [key: string]: string | string[]
}

export interface MetaDataProperty {
  vmid?: string,
  [key: string]: any
}

export interface MetaPropertyCharset extends MetaDataProperty {
  charset: string,
}

export interface MetaPropertyEquiv extends MetaDataProperty {
  httpEquiv: string,
  name: string,
  template?: (chunk: string) => string
}

export interface MetaPropertyName extends MetaDataProperty {
  name: string,
  content: string,
  template?: (chunk: string) => string
}

// non-w3c interface
export interface MetaPropertyProperty extends MetaDataProperty {
  property: string,
  content: string,
  template?: (chunk: string) => string
}

export interface LinkProperty extends MetaDataProperty {
  rel: string,
  crossOrigin?: string | null,
  href?: string,
  hreflang?: string,
  media?: string,
  nonce?: string,
  referrerPolicy?: string,
  rev?: string,
  type?: string,
}

export interface StyleProperty extends MetaDataProperty {
  cssText: string,
  media?: string,
  nonce?: string,
  type?: string,
}

export interface ScriptPropertyBase extends MetaDataProperty {
  type?: string,
  charset?: string,
  body?: boolean,
  async?: boolean,
  defer?: boolean,
  crossOrigin?: string,
  nonce?: string
}

export interface ScriptPropertyText extends ScriptPropertyBase {
  innerHTML: string,
}

export interface ScriptPropertySrc extends ScriptPropertyBase {
  src: string,
}

export interface NoScriptProperty extends MetaDataProperty {
  innerHTML: string,
}

export interface MetaInfo {
  title?: string
  titleTemplate?: string | ((titleChunk: string) => string)

  htmlAttrs?: AttributeProperty
  headAttrs?: AttributeProperty
  bodyAttrs?: AttributeProperty

  base?: {
    target: string,
    href: string
  }

  meta?: (MetaPropertyCharset | MetaPropertyEquiv | MetaPropertyName | MetaPropertyProperty)[]
  link?: LinkProperty[]
  style?: StyleProperty[]
  script?: (ScriptPropertyText | ScriptPropertySrc)[]
  noscript?: NoScriptProperty[]

  __dangerouslyDisableSanitizers?: string[]
  __dangerouslyDisableSanitizersByTagID?: {
    [key: string]: string[]
  }

  changed?: <T extends MetaInfo>(newInfo: T, addedTags: elements, removedTags: elements) => void
  afterNavigation?: <T extends MetaInfo>(newInfo: T) => void
}

export type MetaInfoComputed = () => MetaInfo

interface ToText {
  text(): string
}

interface ToBodyTextOption {
  body: boolean
}
interface ToBodyText {
  text(options?: ToBodyTextOption): string
}

export interface MetaInfoSSR {
  title?: ToText
  htmlAttrs?: ToText
  headAttrs?: ToText
  bodyAttrs?: ToText
  base?: ToText
  meta?: ToText
  link?: ToText
  style?: ToText
  script?: ToBodyText
  noscript?: ToBodyText
}
