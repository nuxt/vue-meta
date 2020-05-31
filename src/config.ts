import { isArray } from '@vue/shared'
import { tags } from './config/tags'
import { TODO } from './types'

export interface ConfigOption {
  tag?: string
  target?: string
  group?: boolean
  nameAttribute?: string
  contentAttribute?: string
  nameless?: boolean
  namespaced?: boolean
  namespacedAttribute?: boolean
}

const defaultMapping: { [key: string]: ConfigOption } = {
  body: {
    tag: 'script',
    target: 'body',
  },
  base: {
    contentAttribute: 'href',
  },
  charset: {
    tag: 'meta',
    nameless: true,
    contentAttribute: 'charset',
  },
  description: {
    tag: 'meta',
  },
  og: {
    group: true,
    namespacedAttribute: true,
    tag: 'meta',
    nameAttribute: 'property',
  },
  twitter: {
    group: true,
    namespacedAttribute: true,
    tag: 'meta',
  },
}

export { defaultMapping }

export function hasConfig(name: string): boolean {
  return !!tags[name] || !!defaultMapping[name]
}

export function getConfigKey(
  name: string | Array<string>,
  key: string,
  config: TODO,
  dontLog?: boolean
): any {
  if (!dontLog) {
    // console.log('getConfigKey', name, key, getConfigKey(name, key, config, true), config)
  }

  if (config && key in config) {
    return config[key]
  }

  if (isArray(name)) {
    for (const _name of name) {
      if (_name && _name in tags) {
        return tags[_name][key]
      }
    }

    return
  }

  if (name in tags) {
    const tag = tags[name]
    return tag[key]
  }
}
