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
  }

export interface MetaPropertyTrueEquiv extends MetaDataProperty {
    'http-equiv': string,
    content: string,
  }

export interface MetaPropertyName extends MetaDataProperty {
    name: string,
    content: string,
  }

export interface MetaPropertyMicrodata extends MetaDataProperty {
    itemprop: string,
    content: string,
  }

// non-w3c interface
export interface MetaPropertyProperty extends MetaDataProperty {
    property: string,
    content: string,
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
    // callback: CallbackFn,
    href?: string,
    hreflang?: string
  }

export interface StyleProperty extends MetaDataProperty {
    cssText: string,
    // callback?: CallbackFn
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
    // callback: CallbackFn
  }

  // eslint-disable-next-line no-use-before-define
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

export interface ComponentMetaInfo {
    title?: string

    htmlAttrs?: AttributeProperty
    headAttrs?: AttributeProperty
    bodyAttrs?: AttributeProperty

    base?: {
      target: string,
      href: string
    }

    meta?: (MetaPropertyCharset | MetaPropertyEquiv | MetaPropertyTrueEquiv | MetaPropertyName | MetaPropertyMicrodata | MetaPropertyProperty)[]
    link?: (LinkPropertyBase | LinkPropertyHref | LinkPropertyHrefCallback)[]
    style?: StyleProperty[]
    script?: (ScriptPropertyText | ScriptPropertySrc | ScriptPropertySrcCallback | ScriptPropertyJson)[]
    noscript?: NoScriptProperty[]
  }

export type ComponentOptionsMetaInfo = ComponentMetaInfo | (() => ComponentMetaInfo)
