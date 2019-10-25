export const internalProps = [
  'prio'
]

export const sortReverse = (a, b) => (b - a)
export const sortMetaData = (a, b) => {
  if (a.prio === b.prio) {
    return a._cid < b._cid ? -1 : 1
  }

  return a.prio > b.prio ? -1 : 1
}

export function createMetaInfoForTypeKey(vm, type, vmid, nestedIndex) {
  return `${vm._vueMeta.id}-${type}${vmid ? '-'.concat(vmid) : ''}${nestedIndex ? '-'.concat(nestedIndex) : ''}`
}

// the depth of a component is the default meta priority, as in
// the deeper the component the more important its meta data
export function getComponentDepth(vm) {
  let depth = 0
  let parent = vm

  while (parent !== vm.$root) {
    depth++
    parent = parent.$parent
  }

  return depth
}

export function updateElement(meta) {
  const el = meta._el || document.createElement('meta')

  // set non-private props as attribute
  Object.keys(meta)
    .filter(key => key[0] !== '_' && !internalProps.includes(key))
    .forEach(key => {
      if (!el.hasAttribute(key) || el.getAttribute(key) != meta[key]) { // eslint-disable-line eqeqeq
        el.setAttribute(key, meta[key])
      }
    })

  if (meta._el) {
    return
  }

  meta._el = el
  document.head.appendChild(el)
}

export function createWatcher(type) {
  return function metaDataWatcher(newValue) {
    if (type === 'title') {
      document.title = (newValue && newValue.content) || ''
      return
    }

    if (Array.isArray(newValue)) {
      newValue.forEach(updateElement)
      return
    }

    updateElement(newValue)
  }
}
