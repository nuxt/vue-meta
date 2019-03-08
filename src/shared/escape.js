import { metaInfoOptionKeys, disableOptionKeys } from './constants'
import isArray from './isArray'
import { isString, isObject } from './typeof'

// sanitizes potentially dangerous characters
export default function escape(info, options, escapeOptions) {
  const { tagIDKeyName } = options
  const { doEscape = v => v } = escapeOptions
  const escaped = {}

  for (const key in info) {
    const value = info[key]

    // no need to escape configuration options
    if (metaInfoOptionKeys.includes(key)) {
      escaped[key] = value
      continue
    }

    let [ disableKey ] = disableOptionKeys
    if (escapeOptions[disableKey] && escapeOptions[disableKey].includes(key)) {
      // this info[key] doesnt need to escaped if the option is listed in __dangerouslyDisableSanitizers
      escaped[key] = value
      continue
    }

    const tagId = info[tagIDKeyName]
    if (tagId) {
      disableKey = disableOptionKeys[1]

      // keys which are listed in __dangerouslyDisableSanitizersByTagID for the current vmid do not need to be escaped
      if (escapeOptions[disableKey] && escapeOptions[disableKey][tagId] && escapeOptions[disableKey][tagId].includes(key)) {
        escaped[key] = value
        continue
      }
    }

    if (isString(value)) {
      escaped[key] = doEscape(value)
    } else if (isArray(value)) {
      escaped[key] = value.map((v) => {
        return isObject(v)
          ? escape(v, options, escapeOptions)
          : doEscape(v)
      })
    } else if (isObject(value)) {
      escaped[key] = escape(value, options, escapeOptions)
    } else {
      escaped[key] = value
    }
  }

  return escaped
}
