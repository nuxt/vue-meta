import { markRaw, reactive, onUnmounted, getCurrentInstance } from 'vue'
import { hasOwn, isObject, isArray, isPlainObject } from '@vue/shared'
import { defaultMapping } from './config'

let appId = 0

const shadow = markRaw({})
const metainfo = reactive({})

export function createMeta ({ resolver, config }) {
  const id = Symbol(`vueMeta[${appId++}]`)

  return {
    install (app) {
      const $metaInfo = {
        id,
        resolver,
        config: {
          ...defaultMapping,
          ...config
        }
      }

      app.config.globalProperties.$metaInfo = $metaInfo
      app.provide('metainfo', metainfo)
    }
  }
}

export function useMeta (obj, context) {
  // set empty object to remove everything
  const unmount = () => setMetainfoByObject(context, {}, shadow, metainfo)

  if (!context) {
    context = getCurrentInstance()

    onUnmounted(unmount)
  }

  if (!context) {
    context = {}
  }

  setMetainfoByObject(context, obj, shadow, metainfo)

  const meta = createProxy(obj, createHandler(context))

  return {
    meta,
    unmount
  }
}

function createProxy (obj, handler) {
  return markRaw(new Proxy(obj, handler))
}

function createHandler (context, keyPath = []) {
  return {
    get (target, prop) {
      const value = target[prop]

      if (!isObject(value)) {
        return value
      }

      if (!value.__vm_proxy) {
        const newKeyPath = [...keyPath, prop]

        const handler = createHandler(context, newKeyPath)
        value.__vm_proxy = createProxy(value, handler)
      }

      return value.__vm_proxy
    },
    set (target, prop, value) {
      updateMetainfo(keyPath, context, prop, value)
      return true
    }
  }
}

function setMetainfo (context, key, value, shadowParent, liveParent, keyTree = []) {
  if (isPlainObject(value)) {
    if (!shadowParent[key]) {
      shadowParent[key] = {}
      liveParent[key] = {}
    }

    return setMetainfoByObject(context, value, shadowParent[key], liveParent[key], keyTree)
  }

  let idx = -1
  if (!hasOwn(shadowParent, key)) {
    shadowParent[key] = []
  } else {
    idx = shadowParent[key].findIndex(({ context: $context }) => $context === context)
  }

  if (idx > -1 && value === undefined) {
    shadowParent[key].splice(idx, 1)
  } else if (idx > -1) {
    shadowParent[key][idx].value = value
  } else if (value) {
    shadowParent[key].push({ context, value })
  }

  resolveActiveMetainfo(context, key, keyTree, shadowParent, liveParent)
}

function setMetainfoByObject (context, obj, shadowParent, liveParent, keyTree = []) {
  for (const key in shadowParent) {
    if (hasOwn(obj, key)) {
      continue
    }

    if (isPlainObject(shadowParent[key])) {
      setMetainfoByObject(context, {}, shadowParent[key], liveParent[key], [...keyTree, key])
      continue
    }

    setMetainfo(context, key, undefined, shadowParent, liveParent, [...keyTree, key])
  }

  for (const key in obj) {
    setMetainfo(context, key, obj[key], shadowParent, liveParent, [...keyTree, key])
  }
}

function updateMetainfo (keyPath, context, key, value) {
  let shadowParent = shadow
  let liveParent = metainfo

  for (const _key of keyPath) {
    shadowParent = shadowParent[_key]
    liveParent = liveParent[_key]
  }

  setMetainfo(context, key, value, shadowParent, liveParent)
}

function resolveActiveMetainfo (context, key, keyTree, shadowParent, liveParent) {
  let value

  if (shadowParent[key].length > 1) {
    value = context.ctx.$metaInfo.resolver(key, shadowParent[key], liveParent[key])
  } else if (shadowParent[key].length) {
    value = shadowParent[key][0].value
  }

  if (value === undefined) {
    delete liveParent[key]
  } else if (!hasOwn(liveParent, key) || liveParent[key] !== value) {
    liveParent[key] = value
  }
}
