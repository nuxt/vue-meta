import { inject, getCurrentInstance, ComponentInternalInstance } from 'vue'
import { metaActiveKey } from './symbols'
import type { MetaManager, MetaActive, MetaSource, MetaProxy } from './types'

export function getCurrentManager (vm?: ComponentInternalInstance): MetaManager | undefined {
  if (!vm) {
    vm = getCurrentInstance() || undefined
  }

  if (!vm) {
    return undefined
  }

  return vm.appContext.config.globalProperties.$metaManager
}

export function useMeta (source: MetaSource, manager?: MetaManager): MetaProxy {
  const vm = getCurrentInstance()

  if (!manager && vm) {
    manager = getCurrentManager(vm)
  }

  if (!manager) {
    // oopsydoopsy
    throw new Error('No manager or current instance')
  }

  return manager.addMeta(source, vm || undefined)
}

export function useActiveMeta (): MetaActive {
  return inject(metaActiveKey)!
}
