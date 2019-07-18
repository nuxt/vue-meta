const callbacks = []
let observer

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

export function addCallbacks ({ tagIDKeyName, loadCallbackAttribute }, tags) {
  let hasAsyncCallback = false

  for (const tag of tags) {
    if (!tag[tagIDKeyName] || !tag.callback) {
      continue
    }

    hasAsyncCallback = true
    addCallback(`[data-${tagIDKeyName}="${tag[tagIDKeyName]}"]`, tag.callback)
  }

  if (!hasAsyncCallback) {
    return
  }

  return addListeners(loadCallbackAttribute)
}

export async function initListeners (dataAttributeName) {
  await waitDOMLoaded()

  return addListeners(dataAttributeName)
}

export function addListeners (dataAttributeName) {
  applyCallbacks(dataAttributeName)

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

  // TODO?: this doesnt catch src attribute changes
  // but thats seems a bit wrong to do anyway
  observer = new MutationObserver(handleMutation)
  observer.observe(document.head, { childList: true })
  observer.observe(document.body, { childList: true })
}

export function applyCallbacks (dataAttributeName, matchElement) {
  for (const [query, callback] of callbacks) {
    const selector = `[data-${dataAttributeName}]${query}`

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
