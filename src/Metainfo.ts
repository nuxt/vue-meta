import { h, defineComponent, Teleport, PropType, VNode, VNodeProps } from 'vue'
import { isArray } from '@vue/shared'
import { renderMeta } from './render'
import { getCurrentManager } from './useApi'
import { MetainfoActive } from './types'

export interface MetainfoProps {
  metainfo: MetainfoActive
}

export function addVnode(targets: any, target: string, vnode: VNode) {
  if (!targets[target]) {
    targets[target] = []
  }

  targets[target].push(vnode)
}

export const MetainfoImpl = defineComponent({
  name: 'Metainfo',
  props: {
    metainfo: {
      type: Object as PropType<MetainfoActive>,
      required: true,
    },
  },
  setup({ metainfo }, { slots }) {
    return () => {
      const targets: any = {}

      const manager = getCurrentManager()

      for (const key in metainfo) {
        const config = manager.config[key] || {}

        const vnodes = renderMeta(
          { metainfo, slots },
          key,
          metainfo[key],
          config
        )
        let defaultTarget =
          (key !== 'base' && metainfo[key].target) || config.target || 'head'

        if (isArray(vnodes)) {
          for (const { target, vnode } of vnodes) {
            addVnode(targets, target || defaultTarget, vnode)
          }
          continue
        }

        const { target, vnode } = vnodes
        addVnode(targets, target || defaultTarget, vnode)
      }

      // console.log('TARGETS', targets)
      return Object.keys(targets).map(target => {
        return h(Teleport, { to: target }, targets[target])
      })
    }
  },
})

export const Metainfo = (MetainfoImpl as any) as {
  new (): {
    $props: VNodeProps & MetainfoProps
  }
}
