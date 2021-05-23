import { tags } from './tags'
import type { MetaTagConfigKey, MetaTagName } from '../types'

export function getTagConfigItem (
  tagOrName: Array<MetaTagName>,
  key: MetaTagConfigKey
): any {
  for (const name of tagOrName) {
    const tag = tags[name]
    if (name && tag) {
      return tag[key]
    }
  }
}
