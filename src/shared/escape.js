import { metaInfoOptionKeys, disableOptionKeys } from './constants'
import isArray from './isArray'
import { isString, isObject } from './typeof'

// sanitizes potentially dangerous characters
export default function escape(info, { tagIDKeyName }, escapeSequences = []) {
  const escaped = {}

  for (const key in info) {
    const value = info[key]

    // no need to escape configuration options
    if (metaInfoOptionKeys.includes(key)) {
      escaped[key] = value
      continue
    }

    let [ disableKey ] = disableOptionKeys
    if (info[disableKey] && info[disableKey].includes(key)) {
      // this info[key] doesnt need to escaped if the option is listed in __dangerouslyDisableSanitizers
      escaped[key] = value
      continue
    }

    if (info[tagIDKeyName]) {
      disableKey = disableOptionKeys[1]

      // items which vmid is listed in __dangerouslyDisableSanitizersByTagID do not need to be escaped
      if (info[disableKey] && info[disableKey][key] && info[disableKey][key].includes(info[tagIDKeyName])) {
        escaped[key] = value
        continue
      }
    }

    if (isString(value)) {
      escaped[key] = escapeSequences.reduce((val, [v, r]) => val.replace(v, r), value)
    } else if (isArray(value)) {
      escaped[key] = value.map((v) => {
        return isObject(v)
          ? escape(v, { tagIDKeyName }, escapeSequences)
          : escapeSequences.reduce((val, [v, r]) => val.replace(v, r), v)
      })
    } else if (isObject(value)) {
      escaped[key] = escape(value, { tagIDKeyName }, escapeSequences)
    } else {
      escaped[key] = value
    }
  }

  return escaped
}
