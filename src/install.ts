import { App } from 'vue'
import { Metainfo } from './Metainfo'
import { metaInfoKey } from './symbols'
import { Manager } from './manager'

declare module '@vue/runtime-core' {
  interface ComponentInternalInstance {
    $metaManager: Manager
  }
}

export function applyMetaPlugin (app: App, manager: Manager, active: Object) {
  app.component('Metainfo', Metainfo)

  app.config.globalProperties.$metaManager = manager
  app.provide(metaInfoKey, active)
}
