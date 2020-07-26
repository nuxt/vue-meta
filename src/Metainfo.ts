import { h, watchEffect, defineComponent, Teleport, PropType, VNode, VNodeProps } from 'vue'
import { isArray, isFunction } from '@vue/shared'
import { renderMeta } from './render'
import { getCurrentManager } from './useApi'
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
  props: {
    metainfo: {
      type: Object as PropType<MetainfoActive>,
      required: true
    }
  },
  setup ({ metainfo }, { attrs, slots }) {
    const tags: { [key: string]: Element } = {}

    watchEffect(() => {
      const attributes = Object.keys(attrs)

      for (const tagName of ['html', 'head', 'body']) {
        const tagAttrs = attributes.filter(attr => attr.startsWith(tagName + '-'))

        if (!tagAttrs.length) {
          continue
        }

        if (!tags[tagName]) {
          const foundTag = document.querySelector(tagName)

          if (foundTag) {
            tags[tagName] = foundTag
          }
        }

        const tag: Element = tags[tagName]

        for (const tagAttr of tagAttrs) {
          const attr: string = tagAttr.slice(5)

          tag.setAttribute(attr, `${attrs[tagAttr] || ''}`)
        }
      }
    })

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
