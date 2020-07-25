import { h, VNode } from 'vue'
import { isArray } from '@vue/shared'
import { getConfigKey } from './config'
import { TODO } from './types'

export interface RenderContext {
  slots: any
  [key: string]: TODO
}

export interface GroupConfig {
  group: string
  data: Array<TODO> | TODO
  tagNamespace?: string
  fullName?: string
  slotName?: string
}

export interface SlotScopeProperties {
  content: any
  metainfo: any
  [key: string]: any
}

export type RenderedMetainfoNode = {
  vnode: VNode
  to?: string
}

export type RenderedMetainfo = Array<RenderedMetainfoNode>

export function renderMeta (
  context: RenderContext,
  key: string,
  data: TODO,
  config: TODO
): RenderedMetainfo | RenderedMetainfoNode {
  console.info('renderMeta', key, data, config)

  if (config.group) {
    return renderGroup(context, key, data, config)
  }

  return renderTag(context, key, data, config)
}

export function renderGroup (
  context: RenderContext,
  key: string,
  data: TODO,
  config: TODO
): RenderedMetainfo | RenderedMetainfoNode {
  console.info('renderGroup', key, data, config)

  if (isArray(data)) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn('Specifying an array for group properties isnt supported as we didnt found a use-case for this yet. If you have one, please create an issue on the vue-meta repo')
    }
    // config.attributes = getConfigKey([key, config.tag], 'attributes', config)
    return []
  }

  return Object.keys(data)
    .map((childKey) => {
      const groupConfig: GroupConfig = {
        group: key,
        data
      }

      if (config.namespaced) {
        groupConfig.tagNamespace = config.namespaced === true ? key : config.namespaced
      } else if (config.namespacedAttribute) {
        const namespace =
          config.namespacedAttribute === true ? key : config.namespacedAttribute

        groupConfig.fullName = `${namespace}:${childKey}`
        groupConfig.slotName = `${namespace}(${childKey})`
      }

      return renderTag(context, key, data[childKey], config, groupConfig)
    })
    .flat()
}

export function renderTag (
  context: RenderContext,
  key: string,
  data: TODO,
  config: TODO = {},
  groupConfig?: GroupConfig
): RenderedMetainfo | RenderedMetainfoNode {
  console.info('renderTag', key, data, config, groupConfig)

  /* TODO: not needed I think
  if (!config.group && isArray(data)) {
    data = { children: data }
  } */

  let content, hasChilds

  if (isArray(data)) {
    return data
      .map((child) => {
        return renderTag(context, key, child, config, groupConfig)
      })
      .flat()
  } else if (data.children && isArray(data.children)) {
    content = data.children.map((child: string | TODO) => {
      const data = renderTag(context, key, child, config, groupConfig)

      if (isArray(data)) {
        return data.map(({ vnode }) => vnode)
      }

      return data.vnode
    })
    hasChilds = true
  } else {
    content = data
  }

  const { tag = config.tag || key } = data

  const fullName = (groupConfig && groupConfig.fullName) || key
  const slotName = (groupConfig && groupConfig.slotName) || key

  let { attrs: attributes } = data
  if (!attributes && typeof data === 'object') {
    attributes = { ...data }

    delete attributes.tag
    delete attributes.children
    delete attributes.to
  } else {
    attributes = {}
  }

  if (hasChilds) {
    content = getSlotContent(context, slotName, content, data)
  } else {
    const tagAttributes = getConfigKey([tag, config.tag], 'attributes', config)
    console.log('tagAttributes', tagAttributes, config, tag)
    if (tagAttributes) {
      if (!config.nameless) {
        const keyAttribute = getConfigKey([tag, config.tag], 'keyAttribute', config)
        if (keyAttribute) {
          attributes[keyAttribute] = fullName
        }
      }

      const valueAttribute = config.valueAttribute || tagAttributes[0]
      attributes[valueAttribute] = getSlotContent(
        context,
        slotName,
        attributes[valueAttribute] || content,
        groupConfig
      )
      content = undefined
    } else {
      content = getSlotContent(context, slotName, content, data)
    }
  }

  const finalTag =
    groupConfig && groupConfig.tagNamespace
      ? `${groupConfig.tagNamespace}:${tag}`
      : tag

  // console.info('FINAL TAG', finalTag)
  // console.log('      ATTRIBUTES', attributes)
  // console.log('      CONTENT', content)
  // // console.log(data, attributes, config)

  if (hasChilds) {
    for (const child of content) {
      if (child.type === finalTag) {
        // TODO: what was this about again?!?!?!?!
        return content
      }

      break
    }
  }

  const vnode = h(finalTag, attributes, content)

  return {
    to: data.to,
    vnode
  }
}

export function getSlotContent (
  { metainfo, slots }: RenderContext,
  slotName: string,
  content: any,
  groupConfig?: GroupConfig
): TODO {
  if (!slots || !slots[slotName]) {
    return content
  }

  const slotProps: SlotScopeProperties = {
    content,
    metainfo
  }

  if (groupConfig && groupConfig.group) {
    slotProps[groupConfig.group] = groupConfig.data
  }

  const slotContent = slots[slotName](slotProps)

  if (slotContent && slotContent.length) {
    return slotContent[0].children
  }

  return content
}
