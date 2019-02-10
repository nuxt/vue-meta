import deepmerge from 'deepmerge'
import isPlainObject from 'lodash.isplainobject'
import isArray from './isArray'
import getComponentOption from './getComponentOption'

const escapeHTML = str => typeof window === 'undefined'
  // server-side escape sequence
  ? String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
  // client-side escape sequence
  : String(str)
    .replace(/&/g, '\u0026')
    .replace(/</g, '\u003c')
    .replace(/>/g, '\u003e')
    .replace(/"/g, '\u0022')
    .replace(/'/g, '\u0027')

const applyTemplate = (component, template, chunk) =>
  typeof template === 'function' ? template.call(component, chunk) : template.replace(/%s/g, chunk)

/**
 * Returns the correct meta info for the given component
 * (child components will overwrite parent meta info)
 *
 * @param  {Object} component - the Vue instance to get meta info from
 * @return {Object} - returned meta info
 */
export default function getMetaInfo({ keyName, tagIDKeyName, metaTemplateKeyName, contentKeyName } = {}, component) {
  // set some sane defaults
  const defaultInfo = {
    title: '',
    titleChunk: '',
    titleTemplate: '%s',
    htmlAttrs: {},
    bodyAttrs: {},
    headAttrs: {},
    meta: [],
    base: [],
    link: [],
    style: [],
    script: [],
    noscript: [],
    __dangerouslyDisableSanitizers: [],
    __dangerouslyDisableSanitizersByTagID: {}
  }

  // collect & aggregate all metaInfo $options
  let info = getComponentOption({
    deep: true,
    component,
    keyName,
    metaTemplateKeyName,
    tagIDKeyName,
    contentKeyName,
    arrayMerge(target, source) {
      // we concat the arrays without merging objects contained in,
      // but we check for a `vmid` property on each object in the array
      // using an O(1) lookup associative array exploit
      // note the use of "for in" - we are looping through arrays here, not
      // plain objects
      const destination = []

      for (const targetIndex in target) {
        const targetItem = target[targetIndex]
        let shared = false

        for (const sourceIndex in source) {
          const sourceItem = source[sourceIndex]

          if (targetItem[tagIDKeyName] && targetItem[tagIDKeyName] === sourceItem[tagIDKeyName]) {
            const targetTemplate = targetItem[metaTemplateKeyName]
            const sourceTemplate = sourceItem[metaTemplateKeyName]

            if (targetTemplate && !sourceTemplate) {
              sourceItem[contentKeyName] = applyTemplate(component, targetTemplate, sourceItem[contentKeyName])
            }

            // If template defined in child but content in parent
            if (targetTemplate && sourceTemplate && !sourceItem[contentKeyName]) {
              sourceItem[contentKeyName] = applyTemplate(component, sourceTemplate, targetItem[contentKeyName])
              delete sourceItem[metaTemplateKeyName]
            }

            shared = true
            break
          }
        }

        if (!shared) {
          destination.push(targetItem)
        }
      }

      return destination.concat(source)
    }
  })

  // Remove all "template" tags from meta

  // backup the title chunk in case user wants access to it
  if (info.title) {
    info.titleChunk = info.title
  }

  // replace title with populated template
  if (info.titleTemplate) {
    info.title = applyTemplate(component, info.titleTemplate, info.titleChunk || '')
  }

  // convert base tag to an array so it can be handled the same way
  // as the other tags
  if (info.base) {
    info.base = Object.keys(info.base).length ? [info.base] : []
  }

  const ref = info.__dangerouslyDisableSanitizers
  const refByTagID = info.__dangerouslyDisableSanitizersByTagID

  // sanitizes potentially dangerous characters
  const escape = info => Object.keys(info).reduce((escaped, key) => {
    let isDisabled = ref && ref.includesOf(key)
    const tagID = info[tagIDKeyName]

    if (!isDisabled && tagID) {
      isDisabled = refByTagID && refByTagID[tagID] && refByTagID[tagID].includes(key)
    }

    const val = info[key]
    escaped[key] = val

    if (key === '__dangerouslyDisableSanitizers' || key === '__dangerouslyDisableSanitizersByTagID') {
      return escaped
    }

    if (!isDisabled) {
      if (typeof val === 'string') {
        escaped[key] = escapeHTML(val)
      } else if (isPlainObject(val)) {
        escaped[key] = escape(val)
      } else if (isArray(val)) {
        escaped[key] = val.map(escape)
      } else {
        escaped[key] = val
      }
    } else {
      escaped[key] = val
    }

    return escaped
  }, {})

  // merge with defaults
  info = deepmerge(defaultInfo, info)

  // begin sanitization
  info = escape(info)

  return info
}
