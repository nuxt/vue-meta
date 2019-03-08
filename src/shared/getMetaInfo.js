import applyTemplate from './applyTemplate'
import { defaultInfo, disableOptionKeys } from './constants'
import { ensureIsArray } from './ensure'
import escape from './escape'
import getComponentOption from './getComponentOption'

/**
 * Returns the correct meta info for the given component
 * (child components will overwrite parent meta info)
 *
 * @param  {Object} component - the Vue instance to get meta info from
 * @return {Object} - returned meta info
 */
export default function getMetaInfo({ keyName, tagIDKeyName, metaTemplateKeyName, contentKeyName } = {}, component, escapeSequences = []) {
  // collect & aggregate all metaInfo $options
  let info = getComponentOption({
    component,
    keyName,
    metaTemplateKeyName,
    tagIDKeyName,
    contentKeyName
  }, defaultInfo)

  // Remove all "template" tags from meta

  // backup the title chunk in case user wants access to it
  if (info.title) {
    info.titleChunk = info.title
  }

  // replace title with populated template
  if (info.titleTemplate && info.titleTemplate !== '%s') {
    applyTemplate({ component, contentKeyName: 'title' }, info, info.titleTemplate, info.titleChunk || '')
  }

  // convert base tag to an array so it can be handled the same way
  // as the other tags
  if (info.base) {
    info.base = Object.keys(info.base).length ? [info.base] : []
  }

  for (const index in disableOptionKeys) {
    const disableKey = disableOptionKeys[index]
    if (!info[disableKey]) {
      continue
    }

    if (index === 0) {
      ensureIsArray(info, disableKey)
    } else if (index === 1) {
      for (const key in info[disableKey]) {
        ensureIsArray(info[disableKey], key)
      }
    }
  }

  // begin sanitization
  info = escape(info, { tagIDKeyName }, escapeSequences)

  return info
}
