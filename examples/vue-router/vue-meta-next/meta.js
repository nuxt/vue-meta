import Vue from 'vue'
import {
  sortReverse,
  sortMetaData,
  createMetaInfoForTypeKey,
  createWatcher
} from './util'

// This object contains the metadata returned by vue components
// grouped by vmid. metadata without vmid is not listed here.
// The purpose of this object is to be able to re-assign the vmid
// when the VueComponent that supplied the vmid with the highest priority
// gets destroyed
// -> title is a special case, its always treated as if it has a vmid
export const allMetaData = {
  title: [],
  meta: {}
}

// This object shadows the metadata that is actually rendered
// -> title is a special case, its always treated as if it has a vmid
// -> for meta (and link, script, etc) the signature here is: {
// any: [] // <- an array with all metadata objects without a vmid
// [vmid]: {} // <- for each vmid the vmid is used as key with the metadata object as value
export const displayedMetaData = Vue.observable({
  title: undefined,
  meta: {
    any: []
  }
})

// find the meta data with the highest priority, if multiple components exists
// with the same priority then the lowest component id is used
function evaluateMetaDataToUse(vm, type, key) {
  // TODO: add error handling
  if (key) {
    const allMetaDataForTypeById = allMetaData[type][key]

    if (allMetaDataForTypeById.length > 1) {
      allMetaDataForTypeById.sort(sortMetaData)
    }

    // re-use the previous HTMLElement if possible
    if (displayedMetaData[type][key]) {
      // we need to copy the HTMLElement and unwatch function if they exist
      for (const prop of ['_el', '_unwatch']) {
        allMetaDataForTypeById[0][prop] = displayedMetaData[type][key][prop]
      }
    }

    // add watcher
    Vue.set(displayedMetaData[type], key, allMetaDataForTypeById[0])

    // check if this a new element that wasnt displayed before, if so
    // add a watcher to create/modify the HTMLElement and store the
    // returned unwatcher to prevent memory leaks
    if (!allMetaDataForTypeById[0]._unwatch) {
      const unwatch = vm.$root.$watch(
        `$data.metaInfo.${type}.${key}`,
        createWatcher(type),
        { deep: true, immediate: true }
      )

      allMetaDataForTypeById[0]._unwatch = unwatch
    }
    return
  }

  // TODO: this should only be called for title? maybe base?

  const allMetaDataForTypeById = allMetaData[type]
  if (allMetaDataForTypeById.length > 1) {
    // only sort when there is more then 1 element
    allMetaDataForTypeById.sort(sortMetaData)
  }

  Vue.set(displayedMetaData, type, allMetaDataForTypeById[0])
}

// This method is called every time a watcher is triggered on the
// classic metaInfo / head property of a SFC
export function updateMetaInfo(vm, data) {
  for (const type in data) {
    if (typeof data[type] === 'function') {
      console.warn(`prop ${type} ignored, function within functions are not supported`)
      continue
    }
    updateMetaInfoForType(vm, data[type], type)
  }
}

// To support changes bya single type (meta, link script) only, this method is
// used as the real updater method. It can also call itself
// -> nestedIndex: important prop. Its the indicator which groups updates returned
// from a meta array element item function. The index is 1-based (not 0-base) so
// we can still check for falsy values, eg:
// metaInfo: {
//   meta: [ // <- calls updateMetaInfoForType without nestedIndex
//     function () { return {} }, // <- calls updateMetaInfoForType without nestedIndex = 1
//     function () { return {} }  // <- calls updateMetaInfoForType without nestedIndex = 2
//   ],
export function updateMetaInfoForType(vm, data, type, nestedIndex) {
  nestedIndex = nestedIndex || 0

  const _cid = vm._vueMeta.id
  const allMetaDataForType = allMetaData[type]

  if (type === 'title') {
    const index = allMetaDataForType.findIndex(metaData => metaData._cid === _cid)

    if (index === -1) {
      allMetaDataForType.push({ _cid, prio: vm._vueMeta.depth || _cid, content: data })

      evaluateMetaDataToUse(vm, type)
    } else {
      allMetaDataForType[index].content = data
    }

    return
  }

  if (!Array.isArray(data)) {
    console.log(`What is this, an unsupported feature perhaps? Expected array for ${type}`)
    return
  }

  const vmidsSeen = []

  for (const [idx, metaData] of Object.entries(data)) {
    if (typeof metaData === 'function') {
      const unwatch = vm.$watch(
        metaData,
        (newValue) => {
          // ensure its an array
          if (!Array.isArray(newValue)) {
            newValue = [newValue]
          }
          updateMetaInfoForType(vm, newValue, type, idx + 1)
        },
        { immediate: true }
      )
      vm._vueMeta.unwatch.push(unwatch)
      continue
    }

    const { vmid } = metaData
    if (!vmid) {
      continue
    }

    vmidsSeen.push(vmid)

    allMetaDataForType[vmid] = allMetaDataForType[vmid] || []

    // TODO: not sure anymore if we need this
    const _key = createMetaInfoForTypeKey(vm, vmid, nestedIndex)
    const prio = metaData.prio || vm._vueMeta.depth || _cid
    const index = allMetaDataForType[vmid].findIndex(metaData => metaData._key === _key)

    // set this before the splice when vmid was already lsited
    const newOrPrioChanged = index === -1 || allMetaDataForType[vmid][index].prio !== prio

    // we can assign directly to metaData because its the result of a watcher
    metaData = Object.assign(metaData, {
      _cid,
      _nested: nestedIndex,
      _key,
      prio
    })

    if (index === -1) {
      allMetaDataForType[vmid].push(metaData)
    } else {
      // we are going to assign the metadata object to the eixsiting one in allMetaData
      // TODO: is this really necessary? cant we just copy el/unwatch again and thats it? think so?
      for (const prop in allMetaDataForType[vmid][index]) {
        // we need to keep these props and we know they dont
        if (['_el', '_unwatch'].includes(prop) || prop in metaData) {
          continue
        }

        delete allMetaDataForType[vmid][index][prop]
      }

      Object.assign(allMetaDataForType[vmid][index], metaData)
    }

    // only re-evaluate which data to show when its new data or the priority has changed
    if (newOrPrioChanged) {
      evaluateMetaDataToUse(vm, type, vmid)
    }
  }

  // remove old/previous metadata from this component
  removeMetaDataForType(vm, _cid, type, ({ vmid, _nested }) => {
    // dont remove if the metadata has a different nesting index
    if (nestedIndex !== _nested) {
      return false
    }

    // remove if metadata doesnt has vmid or when its vmid wasnt listed in this update
    return !vmid || !vmidsSeen.includes(vmid)
  })

  for (const metaData of data) {
    if (typeof metaData === 'function' || metaData.vmid) {
      // these types have already been handled above, ignore
      continue
    }

    // clone metaData!!
    displayedMetaData[type].any.push({
      ...metaData,
      _cid,
      _nested: nestedIndex
    })
  }
}

export function removeMetaDataForType(vm, componentId, type, filter) {
  for (const key in displayedMetaData[type]) {
    if (key === 'any') {
      // the any key lists all the metadata without a vmid
      displayedMetaData[type][key]
        .map((metaData, index) => {
          if (metaData._cid !== componentId) {
            return -1
          }

          if (filter && !filter(metaData)) {
            return -1
          }

          return index
        })
        .filter(index => index > -1)
        // reverse sort to make sure array indexes arent changed after splicing
        .sort(sortReverse)
        .map(index => {
          const { _el: el, vmid } = displayedMetaData[type][key][index]
          if (el) {
            el.remove()
          }

          displayedMetaData[type][key].splice(index, 1)

          if (vmid) {
            evaluateMetaDataToUse(vm, type, vmid)
          }
        })

      continue
    }

    // all other keys are vmid's, check that the currently rendered meta data
    // belongs to the current component. If so, remove the metadata and
    // re-assign the rendered vmid to a new value (if possible)
    const { _cid, _el, _unwatch, vmid } = displayedMetaData[type][key]
    if (_cid === componentId) {
      // only remove vmids which we havent seen
      if (filter && !filter(displayedMetaData[type][key])) {
        continue
      }

      if (_el) {
        _el.remove()
      }

      if (_unwatch) {
        _unwatch()
      }

      displayedMetaData[type][key] = null
      evaluateMetaDataToUse(vm, type, vmid)
    }
  }
}

// remove all the meta data from a component once it gets destroyed
export function onComponentDestroyed(vm, componentId) {
  if (!vm.$options.metaInfo) {
    return
  }

  vm._vueMeta.unwatch.forEach(unwatch => unwatch())

  componentId = componentId || vm._vueMeta.id

  for (const type in allMetaData) {
    if (type === 'title') {
      const reassignInfo = displayedMetaData[type] && displayedMetaData[type]._cid === componentId
      const index = allMetaData[type].findIndex(({ _cid }) => _cid === componentId)

      if (index > -1) {
        allMetaData[type].splice(index, 1)

        if (reassignInfo) {
          evaluateMetaDataToUse(vm, type)
        }
      }
      continue
    }

    for (const vmid in allMetaData[type]) {
      const index = allMetaData[type][vmid].findIndex(({ _cid }) => _cid === componentId)
      if (index > -1) {
        allMetaData[type][vmid].splice(index, 1)
      }
    }
  }

  for (const type in displayedMetaData) {
    if (type === 'title') {
      continue
    }

    removeMetaDataForType(vm, componentId, type)
  }
}
