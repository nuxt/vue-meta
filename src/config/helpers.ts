import type { MetaTagConfigKey, MetaTagName } from '../types'
import { tags } from './tags'

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
