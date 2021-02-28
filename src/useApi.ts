import { inject, getCurrentInstance, ComponentInternalInstance, isProxy, watch } from 'vue'
import type { MetaManager } from './manager'
import { metaActiveKey } from './symbols'
import type { MetaActive, MetaSource, MetaProxy } from './types'
import { applyDifference } from './utils/diff'

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
  const vm = getCurrentInstance() || undefined

  if (!manager && vm) {
    manager = getCurrentManager(vm)
  }

  if (!manager) {
    throw new Error('No manager or current instance')
  }

  if (isProxy(source)) {
    watch(source, (newSource, oldSource) => {
      // We only care about first level props, second+ level will already be changed by the merge proxy
      applyDifference(metaProxy.meta, newSource, oldSource)
    })

    source = source.value
  }

  const metaProxy = manager.addMeta(source, vm)
  return metaProxy
}

export function useActiveMeta (): MetaActive {
  return inject(metaActiveKey)!
}
