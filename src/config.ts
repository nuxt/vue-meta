import { isArray } from '@vue/shared'
import { tags } from './config/tags'
import { TODO } from './types'

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

const defaultMapping: { [key: string]: ConfigOption } = {
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

export { defaultMapping }

export function hasConfig (name: string): boolean {
  return !!tags[name] || !!defaultMapping[name]
}

export function getConfigKey (
  tagOrName: string | Array<string>,
  key: string,
  config: TODO
): any {
  if (config && key in config) {
    return config[key]
  }

  if (isArray(tagOrName)) {
    for (const name of tagOrName) {
      if (name && name in tags) {
        return tags[name][key]
      }
    }

    return
  }

  if (tagOrName in tags) {
    const tag = tags[tagOrName]
    return tag[key]
  }
}
