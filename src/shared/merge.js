import deepmerge from 'deepmerge'
import applyTemplate from './applyTemplate'
import { metaInfoAttributeKeys } from './constants'

export function arrayMerge({ component, tagIDKeyName, metaTemplateKeyName, contentKeyName }, target, source) {
  // we concat the arrays without merging objects contained in,
  // but we check for a `vmid` property on each object in the array
  // using an O(1) lookup associative array exploit
  const destination = []

  target.forEach((targetItem, targetIndex) => {
    // no tagID so no need to check for duplicity
    if (!targetItem[tagIDKeyName]) {
      destination.push(targetItem)
      return
    }

    const sourceIndex = source.findIndex(item => item[tagIDKeyName] === targetItem[tagIDKeyName])
    const sourceItem = source[sourceIndex]

    // source doesnt contain any duplicate id's
    // or the source item should be ignored
    if (sourceIndex === -1 ||
      (sourceItem.hasOwnProperty(contentKeyName) && sourceItem[contentKeyName] === undefined) ||
      (sourceItem.hasOwnProperty('innerHTML') && sourceItem.innerHTML === undefined)
    ) {
      destination.push(targetItem)
      return
    }

    // if source specifies null as content then ignore both the target as the source
    if (sourceItem[contentKeyName] === null || sourceItem.innerHTML === null) {
      // remove current index from source array so its not concatenated to destination below
      source.splice(sourceIndex, 1)
      return
    }

    // we now know that targetItem is a duplicate and we should ignore it in favor of sourceItem
    // now we only need to check if the target has a template to combine it with the source
    const targetTemplate = targetItem[metaTemplateKeyName]
    if (!targetTemplate) {
      return
    }

    const sourceTemplate = sourceItem[metaTemplateKeyName]

    if (!sourceTemplate) {
      // use parent template and child content
      applyTemplate({ component, metaTemplateKeyName, contentKeyName }, sourceItem, targetTemplate)
    } else if (!sourceItem[contentKeyName]) {
      // use child template and parent content
      applyTemplate({ component, metaTemplateKeyName, contentKeyName }, sourceItem, undefined, targetItem[contentKeyName])
    }
  })

  return destination.concat(source)
}

export function merge(target, source, options = {}) {
  // remove properties explicitly set to false so child components can
  // optionally _not_ overwrite the parents content
  // (for array properties this is checked in arrayMerge)
  if (source.hasOwnProperty('title') && source.title === undefined) {
    delete source.title
  }

  for (const attrKey in metaInfoAttributeKeys) {
    if (!source[attrKey]) {
      continue
    }

    for (const key in source[attrKey]) {
      if (source[attrKey].hasOwnProperty(key) && source[attrKey][key] === undefined) {
        delete source[attrKey][key]
      }
    }
  }

  return deepmerge(target, source, {
    arrayMerge: (t, s) => arrayMerge(options, t, s)
  })
}
