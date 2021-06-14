import { MetaConfig } from '../types'

export const defaultConfig: MetaConfig = {
  body: {
    tag: 'script',
    to: 'body'
  },
  base: {
    valueAttribute: 'href'
  },
  charset: {
    tag: 'meta',
    nameless: true,
    valueAttribute: 'charset'
  },
  description: {
    tag: 'meta'
  },
  og: {
    group: true,
    namespacedAttribute: true,
    tag: 'meta',
    keyAttribute: 'property'
  },
  twitter: {
    group: true,
    namespacedAttribute: true,
    tag: 'meta'
  },
  'theme-color': {
    tag: 'meta',
    keyAttribute: 'name',
  },
  htmlAttrs: {
    attributesFor: 'html'
  },
  headAttrs: {
    attributesFor: 'head'
  },
  bodyAttrs: {
    attributesFor: 'body'
  }
}
