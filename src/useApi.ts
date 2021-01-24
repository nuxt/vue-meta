import { inject, getCurrentInstance, ComponentInternalInstance } from 'vue'
import { metaInfoKey } from './symbols'
import type { Manager, MetainfoActive, MetainfoInput, MetaProxy } from './types'

export function getCurrentManager (vm?: ComponentInternalInstance): Manager {
  if (!vm) {
    vm = getCurrentInstance()!
  }

  return vm.appContext.config.globalProperties.$metaManager
}

export function useMeta (obj: MetainfoInput, manager?: Manager): MetaProxy {
  const vm = getCurrentInstance()

  if (!manager && vm) {
    manager = getCurrentManager(vm)
  }

  if (!manager) {
    // oopsydoopsy
    throw new Error('No manager or current instance')
  }

  return manager.addMeta(obj, vm || undefined)
}

export function useMetainfo (): MetainfoActive {
  return inject(metaInfoKey)!
}
