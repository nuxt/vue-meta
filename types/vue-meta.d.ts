import './vue'
import Vue, { ComponentOptions, PluginFunction } from 'vue'

type Component = ComponentOptions<Vue> | typeof Vue
type CallbackFn = () => void
type elements = HTMLElement[]

export interface VueMetaOptionsRuntime {
  refreshOnceOnNavigation?: boolean
  debounceWait?: number
  waitOnDestroyed?: boolean
}

export interface VueMetaOptions extends VueMetaOptionsRuntime {
  keyName: string, // the component option name that vue-meta looks for meta info on.
  attribute: string, // the attribute name vue-meta adds to the tags it observes
  ssrAppId: string, // the app id used for ssr app
  ssrAttribute: string, // the attribute name that lets vue-meta know that meta info has already been server-rendered
  tagIDKeyName: string // the property name that vue-meta uses to determine whether to overwrite or append a tag
}

export declare class VueMeta {
  static version: string
  static install(vue: typeof Vue, options?: VueMetaOptions): PluginFunction<never>
  static hasMetaInfo(vm: Component): boolean
  static generate(metaInfo: MetaInfo, options?: Object): MetaInfoSSR
}

interface RefreshedTags {
  addedTags: elements
  removedTags: elements
}

interface Refreshed {
  vm: Component,
  metaInfo: MetaInfo,
  tags: RefreshedTags
}

interface VueMetaApp {
  set(metaInfo: MetaInfo): void | RefreshedTags
  remove(): void
}

export interface VueMetaPlugin {
  getOptions(): VueMetaOptions
  setOptions(runtimeOptions: VueMetaOptionsRuntime): VueMetaOptions
  addApp(appName: string): VueMetaApp
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
  once?: boolean,
  skip?: boolean,
  body?: boolean,
  pbody?: boolean,
  [key: string]: any
}

export interface MetaPropertyCharset extends MetaDataProperty {
  charset: string,
}

export interface MetaPropertyEquiv extends MetaDataProperty {
  httpEquiv: string,
  content: string,
  template?: (chunk: string) => string
}

export interface MetaPropertyName extends MetaDataProperty {
  name: string,
  content: string,
  template?: (chunk: string) => string
}

export interface MetaPropertyMicrodata extends MetaDataProperty {
  itemprop: string,
  content: string,
  template?: (chunk: string) => string
}

// non-w3c interface
export interface MetaPropertyProperty extends MetaDataProperty {
  property: string,
  content: string,
  template?: (chunk: string) => string
}

export interface LinkPropertyBase extends MetaDataProperty {
  rel: string,
  crossOrigin?: string | null,
  media?: string,
  nonce?: string,
  referrerPolicy?: string,
  rev?: string,
  type?: string
}

export interface LinkPropertyHref extends LinkPropertyBase {
  href?: string,
  hreflang?: string,
  callback?: void
}

export interface LinkPropertyHrefCallback extends LinkPropertyBase {
  vmid: string,
  callback: CallbackFn,
  href?: string,
  hreflang?: string
}

export interface StyleProperty extends MetaDataProperty {
  cssText: string,
  callback?: CallbackFn
  media?: string,
  nonce?: string,
  type?: string,
}

export interface ScriptPropertyBase extends MetaDataProperty {
  type?: string,
  charset?: string,
  async?: boolean,
  defer?: boolean,
  crossOrigin?: string,
  nonce?: string
}

export interface ScriptPropertyText extends ScriptPropertyBase {
  innerHTML: string
}

export interface ScriptPropertySrc extends ScriptPropertyBase {
  src: string,
  callback?: void
}

export interface ScriptPropertySrcCallback extends ScriptPropertyBase {
  vmid: string,
  callback: CallbackFn
}

type JsonVal = string | number | boolean | JsonObj | JsonObj[] | null

interface JsonObj {
  [key: string]: JsonVal | JsonVal[]
}

export interface ScriptPropertyJson extends ScriptPropertyBase {
  json: JsonObj
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

  meta?: (MetaPropertyCharset | MetaPropertyEquiv | MetaPropertyName | MetaPropertyMicrodata | MetaPropertyProperty)[]
  link?: (LinkPropertyBase | LinkPropertyHref | LinkPropertyHrefCallback)[]
  style?: StyleProperty[]
  script?: (ScriptPropertyText | ScriptPropertySrc | ScriptPropertySrcCallback | ScriptPropertyJson)[]
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

interface ToTextBooleanArg {
  text(addSrrAttribute?: boolean): string
}

interface AddLineBreakOption {
  ln: boolean
}

interface ToBodyTextOption {
  body: boolean
}

interface ToPbodyTextOption {
  pbody: boolean
}

interface ToBodyText {
  text(options?: (ToBodyTextOption | ToPbodyTextOption | AddLineBreakOption)): string
}

export interface MetaInfoSSR {
  head(ln?: boolean): string
  bodyPrepend(ln?: boolean): string
  bodyAppend(ln?: boolean): string
  title?: ToText
  htmlAttrs?: ToTextBooleanArg
  headAttrs?: ToText
  bodyAttrs?: ToText
  base?: ToBodyText
  meta?: ToBodyText
  link?: ToBodyText
  style?: ToBodyText
  script?: ToBodyText
  noscript?: ToBodyText
}
