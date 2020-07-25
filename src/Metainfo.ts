import { h, defineComponent, Teleport, PropType, VNode, VNodeProps } from 'vue'
import { isArray } from '@vue/shared'
import { renderMeta } from './render'
import { getCurrentManager } from './useApi'
import { MetainfoActive } from './types'

export interface MetainfoProps {
  metainfo: MetainfoActive
}

export function addVnode (teleports: any, to: string, vnode: VNode) {
  if (!teleports[to]) {
    teleports[to] = []
  }

  teleports[to].push(vnode)
}

export const MetainfoImpl = defineComponent({
  name: 'Metainfo',
  props: {
    metainfo: {
      type: Object as PropType<MetainfoActive>,
      required: true
    }
  },
  setup ({ metainfo }, { slots }) {
    return () => {
      const teleports: any = {}

      const manager = getCurrentManager()

      for (const key in metainfo) {
        const config = manager.config[key] || {}

        const vnodes = renderMeta(
          { metainfo, slots },
          key,
          metainfo[key],
          config
        )
        console.log('RENDERED VNODES', vnodes)
        const defaultTo =
          (key !== 'base' && metainfo[key].to) || config.to || 'head'

        if (isArray(vnodes)) {
          for (const { to, vnode } of vnodes) {
            console.log('VNODE 1', vnode)
            addVnode(teleports, to || defaultTo, vnode)
          }
          continue
        }

        const { to, vnode } = vnodes
        console.log('VNODE 2', vnode)
        addVnode(teleports, to || defaultTo, vnode)
      }

      console.log('TARGETS', teleports)
      return Object.keys(teleports).map((to) => {
        return h(Teleport, { to }, teleports[to])
      })
    }
  }
})

export const Metainfo = (MetainfoImpl as any) as {
  new (): {
    $props: VNodeProps & MetainfoProps
  }
}
