import { inject, getCurrentInstance, onUnmounted } from 'vue'
import { setByObject, remove } from './info'
import { Manager } from './manager'
import { createProxy, createHandler } from './proxy'
import { metaInfoKey, PolySymbol } from './symbols'
import { MetaContext, MetainfoActive, MetainfoInput } from './types'

let contextCounter: number = 0

export function useMeta (obj: MetainfoInput, manager?: Manager) {
  const vm = getCurrentInstance()
  if (vm) {
    manager = vm.appContext.config.globalProperties.$metaManager
  }

  if (!manager) {
    // oopsydoopsy
    throw new Error('No manager or current instance')
  }

  const context: MetaContext = {
    id: PolySymbol(`context ${contextCounter++}`),
    vm: vm || undefined,
    manager
  }

  const unmount = <T extends Function = () => any>() => remove(context)
  if (vm) {
    onUnmounted(unmount)
  }

  manager.resolver.setup(context)

  setByObject(context, obj)

  const handler = /* #__PURE__ */ createHandler(context)
  const meta = createProxy(obj, handler)

  return {
    meta,
    unmount
  }
}

export function useMetainfo (): MetainfoActive {
  return inject(metaInfoKey)!
}

export function getCurrentManager (): Manager {
  const vm = getCurrentInstance()!
  return vm.appContext.config.globalProperties.$metaManager
}
