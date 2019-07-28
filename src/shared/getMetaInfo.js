import { escapeMetaInfo } from '../shared/escaping'
import { applyTemplate } from './template'

/**
 * Returns the correct meta info for the given component
 * (child components will overwrite parent meta info)
 *
 * @param  {Object} component - the Vue instance to get meta info from
 * @return {Object} - returned meta info
 */
export default function getMetaInfo (options = {}, info, escapeSequences = [], component) {
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

  return escapeMetaInfo(options, info, escapeSequences)
}
