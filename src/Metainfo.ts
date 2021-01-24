import { defineComponent, VNodeProps } from 'vue'
import { getCurrentManager } from './useApi'
import { MetainfoActive } from './types'

export interface MetainfoProps {
  metainfo: MetainfoActive
}

export const MetainfoImpl = defineComponent({
  name: 'Metainfo',
  inheritAttrs: false,
  setup (_, { slots }) {
    return () => {
      const manager = getCurrentManager()
      if (!manager) {
        return
      }

      return manager.render({ slots })
    }
  }
})

export const Metainfo = (MetainfoImpl as any) as {
  new (): {
    $props: VNodeProps & MetainfoProps
  }
}
