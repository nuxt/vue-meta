import { markRaw, reactive, onMounted, customRef, getCurrentInstance } from 'vue'
import { def, hasOwn, isObject, isArray, isPlainObject } from '@vue/shared'
import { defaultMapping } from './config'

let appId = 0

export function createMeta ({ resolver, config }) {
  const id = Symbol(`vueMeta[${appId++}]`)

  return {
    install (app) {
      const $metaInfo = {
        id,
        resolver,
        shadow: markRaw({}),
        metainfo: reactive({})
      }

      app.config.globalProperties.$metaInfo = $metaInfo
      app.provide('metainfo', $metaInfo.metainfo)
      app.provide('__vueMetaConfig', {
        id,
        ...defaultMapping,
        ...config
      })

      app.config.globalProperties.$meta = this
    }
  }
}

export function useMeta (obj) {
  const vm = getCurrentInstance()

  const { shadow, metainfo } = vm.ctx.$metaInfo
  addMetainfoRecursive(obj, vm, shadow, metainfo)

  return createProxy(obj, createHandler(vm))
}

function createProxy (obj, handler) {
  return new Proxy(obj, handler)
}

function createHandler (vm, keyPath = []) {
  return {
    get (target, prop) {
      const value = target[prop]

      if (isObject(value)) {
        if (!value.__vm_proxy) {
          const newKeyPath = [...keyPath, prop]

          const handler = createHandler(vm, newKeyPath)
          value.__vm_proxy = createProxy(value, handler)
        }

        return value.__vm_proxy
      }

      return value
    },
    set (target, prop, value) {
      updateMetainfo(keyPath, vm, prop, value)
      return true
    }
  }
}

function addMetainfoRecursive (obj, vm, shadowParent, liveParent) {
  for (const key in obj) {
    if (isPlainObject(obj[key])) {
      if (!shadowParent[key]) {
        shadowParent[key] = {}
        liveParent[key] = {}
      }

      addMetainfoRecursive(obj[key], vm, shadowParent[key], liveParent[key])
      continue
    }

    if (!shadowParent[key]) {
      shadowParent[key] = []
    }

    shadowParent[key].push({ vm, value: obj[key] })

    setLive(vm, key, shadowParent, liveParent)
  }
}

function updateMetainfo (keyPath, vm, key, value) {
  let { shadow: shadowParent, metainfo: liveParent } = vm.ctx.$metaInfo

  for (const _key of keyPath) {
    shadowParent = shadowParent[_key]
    liveParent = liveParent[_key]
  }

  if (isPlainObject(value)) {
    if (!shadowParent[key]) {
      shadowParent[key] = {}
      liveParent[key] = {}
    }
    // TODO: fix this shit
    addMetainfoRecursive(value, vm, shadowParent[key], liveParent[key])
    return
  }

  const idx = shadowParent[key].findIndex(({ vm: _vm }) => _vm === vm)
  shadowParent[key][idx].value = value

  setLive(vm, key, shadowParent, liveParent)
}

function setLive (vm, key, shadowParent, liveParent) {
  let value
  if (shadowParent[key].length > 1) {
    value = vm.ctx.$metaInfo.resolver(shadowParent[key])
  } else {
    value = shadowParent[key][0].value
  }

  if (!hasOwn(liveParent, key) || liveParent[key] !== value) {
    liveParent[key] = value
  }
}
