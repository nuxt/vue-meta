const callbacks = []

export function isDOMLoaded () {
  return document.readyState !== 'loading'
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
  applyCallbacks(dataAttributeName)

  if (isDOMLoaded()) {
    return
  }

  /* istanbul ignore next */
  function handleMutation (mutations) {
    for (const mutation of mutations) {
      if (!mutation.addedNodes.length) {
        continue
      }

      for (const node of mutation.addedNodes) {
        if (node.nodeType !== 1) {
          continue
        }

        applyCallbacks(dataAttributeName, node)
      }
    }
  }

  /* istanbul ignore next */
  const observer = new MutationObserver(handleMutation)
  /* istanbul ignore next */
  observer.observe(document.head, { childList: true })
  /* istanbul ignore next */
  observer.observe(document.body, { childList: true })

  /* istanbul ignore next */
  document.onreadystatechange = () => {
    if (isDOMLoaded()) {
      setTimeout(() => observer.disconnect(), 0)
    }
  }
}

export function applyCallbacks (dataAttributeName, matchElement) {
  for (const [query, callback] of callbacks) {
    const selector = `${query}[data-${dataAttributeName}]`

    let elements = []
    if (!matchElement) {
      elements = Array.from(document.querySelectorAll(selector))
    }

    if (matchElement && matchElement.matches(selector)) {
      elements = [matchElement]
    }

    for (const element of elements) {
      element.addEventListener('load', () => {
        element.removeAttribute(`data-${dataAttributeName}`)
        callback(element)
      })
    }
  }
}
