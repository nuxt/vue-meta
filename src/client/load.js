import { toArray } from '../utils/array'
import { querySelector, removeAttribute } from '../utils/elements'

const callbacks = []

export function isDOMLoaded (d) {
  return (d || document).readyState !== 'loading'
}

export function isDOMComplete (d) {
  return (d || document).readyState === 'complete'
}

export function waitDOMLoaded () {
  if (isDOMLoaded()) {
    return true
  }

  return new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve))
}

export function addCallback (query, callback) {
  if (arguments.length === 1) {
    callback = query
    query = ''
  }

  callbacks.push([query, callback])
}

export function addCallbacks ({ tagIDKeyName }, type, tags, autoAddListeners) {
  let hasAsyncCallback = false

  tags.forEach((tag) => {
    if (!tag[tagIDKeyName] || !tag.callback) {
      return
    }

    hasAsyncCallback = true
    addCallback(`${type}[data-${tagIDKeyName}="${tag[tagIDKeyName]}"]`, tag.callback)
  })

  if (!autoAddListeners || !hasAsyncCallback) {
    return hasAsyncCallback
  }

  return addListeners()
}

export function addListeners () {
  if (isDOMComplete()) {
    applyCallbacks()
    return
  }

  // Instead of using a MutationObserver, we just apply
  /* istanbul ignore next */
  document.onreadystatechange = () => {
    applyCallbacks()
  }
}

export function applyCallbacks (matchElement) {
  callbacks.forEach((args) => {
    // do not use destructuring for args, it increases transpiled size
    // due to var checks while we are guaranteed the structure of the cb
    const query = args[0]
    const callback = args[1]
    const selector = `${query}[onload="this.__vm_l=1"]`

    let elements = []
    if (!matchElement) {
      elements = toArray(querySelector(selector))
    }

    if (matchElement && matchElement.matches(selector)) {
      elements = [matchElement]
    }

    elements.forEach((element) => {
      /* __vm_cb: whether the load callback has been called
       * __vm_l: set by onload attribute, whether the element was loaded
       * __vm_ev: whether the event listener was added or not
       */
      if (element.__vm_cb) {
        return
      }

      const onload = () => {
        /* Mark that the callback for this element has already been called,
         * this prevents the callback to run twice in some (rare) conditions
         */
        element.__vm_cb = true

        /* onload needs to be removed because we only need the
         * attribute after ssr and if we dont remove it the node
         * will fail isEqualNode on the client
         */
        removeAttribute(element, 'onload')

        callback(element)
      }

      /* IE9 doesnt seem to load scripts synchronously,
       * causing a script sometimes/often already to be loaded
       * when we add the event listener below (thus adding an onload event
       * listener has no use because it will never be triggered).
       * Therefore we add the onload attribute during ssr, and
       * check here if it was already loaded or not
       */
      if (element.__vm_l) {
        onload()
        return
      }

      if (!element.__vm_ev) {
        element.__vm_ev = true

        element.addEventListener('load', onload)
      }
    })
  })
}
