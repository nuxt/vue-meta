import { isArray } from '@vue/shared'
import { Config } from '../types'
import { tags } from './tags'

export function hasConfig (name: string, config: Config): boolean {
  return !!config[name] || !!tags[name]
}

export function getConfigByKey (
  tagOrName: string | Array<string>,
  key: string,
  config: Config
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
