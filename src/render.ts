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
  target?: string
}

export type RenderedMetainfo = Array<RenderedMetainfoNode>

export function renderMeta(
  context: RenderContext,
  key: string,
  data: TODO,
  config: TODO
): RenderedMetainfo | RenderedMetainfoNode {
  // console.info('renderMeta', key, data, config)

  if (config.group) {
    return renderGroup(context, key, data, config)
  }

  return renderTag(context, key, data, config)
}

export function renderGroup(
  context: RenderContext,
  key: string,
  data: TODO,
  config: TODO
): RenderedMetainfo | RenderedMetainfoNode {
  // console.info('renderGroup', key, data, config)

  if (isArray(data)) {
    config.contentAttributes = getConfigKey(
      [key, config.tag],
      'contentAttributes',
      config
    )
    return data.map(_data => renderTag(context, key, _data, config)).flat()
  }

  return Object.keys(data)
    .map(childKey => {
      const groupConfig: GroupConfig = {
        group: key,
        data,
      }

      if (config.namespaced) {
        groupConfig.tagNamespace =
          config.namespaced === true ? key : config.namespaced
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

export function renderTag(
  context: RenderContext,
  key: string,
  data: TODO,
  config: TODO = {},
  groupConfig?: GroupConfig
): RenderedMetainfo | RenderedMetainfoNode {
  if (!config.group && isArray(data)) {
    data = { content: data }
  }

  let content, hasChilds

  if (isArray(data)) {
    return data
      .map(child => {
        return renderTag(context, key, child, config, groupConfig)
      })
      .flat()
  } else if (data.content && isArray(data.content)) {
    content = data.content.map((child: string | TODO) => {
      if (typeof child === 'string') {
        return child
      }
      return renderTag(context, key, child, config, groupConfig)
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
    delete attributes.content
    delete attributes.target
  } else {
    attributes = {}
  }

  if (hasChilds) {
    content = getSlotContent(context, slotName, content, config, data)
  } else {
    const contentAttributes = getConfigKey(tag, 'contentAttributes', config)

    if (contentAttributes) {
      if (!config.nameless) {
        const nameAttribute = getConfigKey(tag, 'nameAttribute', config)
        if (nameAttribute) {
          attributes[nameAttribute] = fullName
        }
      }

      const contentAttribute = config.contentAttribute || contentAttributes[0]
      attributes[contentAttribute] = getSlotContent(
        context,
        slotName,
        attributes[contentAttribute] || content,
        config,
        groupConfig
      )
      content = undefined
    } else {
      content = getSlotContent(context, slotName, content, config, data)
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
      if (typeof child === 'string') {
        continue
      }

      if (child.type === finalTag) {
        return content
      }

      break
    }
  }

  const vnode = h(finalTag, attributes, content)

  return {
    target: data.target,
    vnode,
  }
}

export function getSlotContent(
  { metainfo, slots }: RenderContext,
  slotName: string,
  content: any,
  config: TODO,
  groupConfig?: GroupConfig
): TODO {
  if (!slots[slotName]) {
    return content
  }

  const slotProps: SlotScopeProperties = {
    content,
    metainfo,
  }

  if (groupConfig && groupConfig.group) {
    slotProps[groupConfig.group] = groupConfig.data
  }

  content = slots[slotName](slotProps)

  if (content.length) {
    return content[0].children
  }

  return ''
}
