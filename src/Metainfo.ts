import { h, defineComponent, Teleport, VNode, VNodeProps } from 'vue'
import { isArray, isFunction } from '@vue/shared'
import { renderMeta } from './render'
import { useMetainfo, getCurrentManager } from './useApi'
import { MetainfoActive } from './types'

export interface MetainfoProps {
  metainfo: MetainfoActive
}

export function addVnode (teleports: any, to: string, vnode: VNode | Array<VNode>) {
  if (!teleports[to]) {
    teleports[to] = []
  }

  if (isArray(vnode)) {
    teleports[to].push(...vnode)
    return
  }

  teleports[to].push(vnode)
}

export const MetainfoImpl = defineComponent({
  name: 'Metainfo',
  inheritAttrs: false,
  setup (_, { slots }) {
    const metainfo = useMetainfo()

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

        if (!vnodes) {
          continue
        }

        const defaultTo =
          (key !== 'base' && metainfo[key].to) || config.to || 'head'

        if (isArray(vnodes)) {
          for (const { to, vnode } of vnodes) {
            addVnode(teleports, to || defaultTo, vnode)
          }
          continue
        }

        const { to, vnode } = vnodes
        addVnode(teleports, to || defaultTo, vnode)
      }

      for (const tag of ['default', 'head', 'body']) {
        const slotFn = slots[tag]
        if (isFunction(slotFn)) {
          addVnode(teleports, tag === 'default' ? 'head' : tag, slotFn({ metainfo }))
        }
      }

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
