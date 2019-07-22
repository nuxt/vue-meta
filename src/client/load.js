const callbacks = []

export function isDOMLoaded () {
  return document.readyState !== 'loading'
}

export function isDOMComplete () {
  return document.readyState === 'complete'
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

  callbacks.push([ query, callback ])
}

export function addCallbacks ({ tagIDKeyName, loadCallbackAttribute }, type, tags, autoAddListeners) {
  let hasAsyncCallback = false

  for (const tag of tags) {
    if (!tag[tagIDKeyName] || !tag.callback) {
      continue
    }

    hasAsyncCallback = true
    addCallback(`${type}[data-${tagIDKeyName}="${tag[tagIDKeyName]}"]`, tag.callback)
  }

  if (!autoAddListeners || !hasAsyncCallback) {
    return hasAsyncCallback
  }

  return addListeners(loadCallbackAttribute)
}

export function addListeners (dataAttributeName) {
  if (isDOMComplete()) {
    applyCallbacks(dataAttributeName)
    return
  }

  // Instead of using a MutationObserver, we just apply
  document.onreadystatechange = () => {
    applyCallbacks(dataAttributeName)
  }
}

export function applyCallbacks (dataAttributeName, matchElement) {
  for (const [query, callback] of callbacks) {
    const selector = `${query}[onload="this.__vm_l=1"]`

    let elements = []
    if (!matchElement) {
      elements = Array.from(document.querySelectorAll(selector))
    }

    if (matchElement && matchElement.matches(selector)) {
      elements = [matchElement]
    }

    for (const element of elements) {
      /* __vm_cb: whether the load callback has been called
       * __vm_l: set by onload attribute, whether the element was loaded
       * __vm_ev: whether the event listener was added or not
       */
      if (element.__vm_cb) {
        continue
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
        element.removeAttribute('onload')

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
        continue
      }

      if (!element.__vm_ev) {
        element.__vm_ev = true

        element.addEventListener('load', onload)
      }
    }
  }
}
