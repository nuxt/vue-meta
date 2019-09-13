import { isString, isArray, isPureObject } from '../utils/is-type'
import { includes } from '../utils/array'
import { ensureIsArray } from '../utils/ensure'
import { metaInfoOptionKeys, disableOptionKeys } from './constants'

export const serverSequences = [
  [/&/g, '&amp;'],
  [/</g, '&lt;'],
  [/>/g, '&gt;'],
  [/"/g, '&quot;'],
  [/'/g, '&#x27;']
]

export const clientSequences = [
  [/&/g, '\u0026'],
  [/</g, '\u003C'],
  [/>/g, '\u003E'],
  [/"/g, '\u0022'],
  [/'/g, '\u0027']
]

// sanitizes potentially dangerous characters
export function escape (info, options, escapeOptions, escapeKeys) {
  const { tagIDKeyName } = options
  const { doEscape = v => v } = escapeOptions
  const escaped = {}

  for (const key in info) {
    const value = info[key]

    // no need to escape configuration options
    if (includes(metaInfoOptionKeys, key)) {
      escaped[key] = value
      continue
    }

    // do not use destructuring for disableOptionKeys, it increases transpiled size
    // due to var checks while we are guaranteed the structure of the cb
    let disableKey = disableOptionKeys[0]

    if (escapeOptions[disableKey] && includes(escapeOptions[disableKey], key)) {
      // this info[key] doesnt need to escaped if the option is listed in __dangerouslyDisableSanitizers
      escaped[key] = value
      continue
    }

    const tagId = info[tagIDKeyName]
    if (tagId) {
      disableKey = disableOptionKeys[1]

      // keys which are listed in __dangerouslyDisableSanitizersByTagID for the current vmid do not need to be escaped
      if (escapeOptions[disableKey] && escapeOptions[disableKey][tagId] && includes(escapeOptions[disableKey][tagId], key)) {
        escaped[key] = value
        continue
      }
    }

    if (isString(value)) {
      escaped[key] = doEscape(value)
    } else if (isArray(value)) {
      escaped[key] = value.map((v) => {
        if (isPureObject(v)) {
          return escape(v, options, escapeOptions, true)
        }

        return doEscape(v)
      })
    } else if (isPureObject(value)) {
      escaped[key] = escape(value, options, escapeOptions, true)
    } else {
      escaped[key] = value
    }

    if (escapeKeys) {
      const escapedKey = doEscape(key)
      if (key !== escapedKey) {
        escaped[escapedKey] = escaped[key]
        delete escaped[key]
      }
    }
  }

  return escaped
}

export function escapeMetaInfo (options, info, escapeSequences = []) {
  // do not use destructuring for seq, it increases transpiled size
  // due to var checks while we are guaranteed the structure of the cb
  const escapeOptions = {
    doEscape: value => escapeSequences.reduce((val, seq) => val.replace(seq[0], seq[1]), value)
  }

  disableOptionKeys.forEach((disableKey, index) => {
    if (index === 0) {
      ensureIsArray(info, disableKey)
    } else if (index === 1) {
      for (const key in info[disableKey]) {
        ensureIsArray(info[disableKey], key)
      }
    }

    escapeOptions[disableKey] = info[disableKey]
  })

  // begin sanitization
  return escape(info, options, escapeOptions)
}
