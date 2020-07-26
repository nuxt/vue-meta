export interface ConfigOption {
  tag?: string
  to?: string
  group?: boolean
  keyAttribute?: string
  valueAttribute?: string
  nameless?: boolean
  namespaced?: boolean
  namespacedAttribute?: boolean
}

export interface Config {
  [key: string]: ConfigOption
}

const defaultConfig: Config = {
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
  }
}

export { defaultConfig }
