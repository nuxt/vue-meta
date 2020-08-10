import { h, VNode } from 'vue'
import { isArray, isString } from '@vue/shared'
import { getConfigByKey } from './config'
import { TODO } from './types'

const cachedElements: {
  [key: string]: {
    el: Element,
    attrs: Array<string>,
  }
} = {}

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
): void | RenderedMetainfo | RenderedMetainfoNode {
  // console.info('renderMeta', key, data, config)

  if (config.attributesFor) {
    return renderAttributes(context, key, data, config)
  }

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
  // console.info('renderGroup', key, data, config)

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
  // console.info('renderTag', key, data, config, groupConfig)

  const contentAttributes = ['content', 'json', 'rawContent']
  const getConfig = (key: string) => getConfigByKey([tag, config.tag], key, config)

  if (isArray(data)) {
    return data
      .map((child) => {
        return renderTag(context, key, child, config, groupConfig)
      })
      .flat()
  }

  const { tag = config.tag || key } = data

  let content
  let hasChilds: boolean = false
  let isRaw: boolean = false

  if (isString(data)) {
    content = data
  } else if (data.children && isArray(data.children)) {
    hasChilds = true

    content = data.children.map((child: string | TODO) => {
      const data = renderTag(context, key, child, config, groupConfig)

      if (isArray(data)) {
        return data.map(({ vnode }) => vnode)
      }

      return data.vnode
    })
  } else {
    let i = 0
    for (const contentAttribute of contentAttributes) {
      if (!content && data[contentAttribute]) {
        if (i === 1) {
          content = JSON.stringify(data[contentAttribute])
        } else {
          content = data[contentAttribute]
        }

        isRaw = i > 1
        break
      }

      i++
    }
  }

  const fullName = (groupConfig && groupConfig.fullName) || key
  const slotName = (groupConfig && groupConfig.slotName) || key

  let { attrs: attributes } = data
  if (!attributes && typeof data === 'object') {
    attributes = { ...data }

    delete attributes.tag
    delete attributes.children
    delete attributes.to

    // cleanup all content attributes
    for (const attr of contentAttributes) {
      delete attributes[attr]
    }
  } else if (!attributes) {
    attributes = {}
  }

  if (hasChilds) {
    content = getSlotContent(context, slotName, content, data)
  } else {
    const contentAsAttribute = getConfig('contentAsAttribute')
    let valueAttribute = config.valueAttribute

    if (!valueAttribute && contentAsAttribute) {
      const tagAttributes = getConfig('attributes')
      valueAttribute = isString(contentAsAttribute) ? contentAsAttribute : tagAttributes[0]
    }

    if (!valueAttribute) {
      content = getSlotContent(context, slotName, content, data)
    } else {
      if (!config.nameless) {
        const keyAttribute = getConfig('keyAttribute')
        if (keyAttribute) {
          attributes[keyAttribute] = fullName
        }
      }

      attributes[valueAttribute] = getSlotContent(
        context,
        slotName,
        attributes[valueAttribute] || content,
        groupConfig
      )

      content = undefined
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

  let vnode

  if (isRaw) {
    attributes.innerHTML = content
    vnode = h(finalTag, attributes)
  } else {
    vnode = h(finalTag, attributes, content)
  }

  return {
    to: data.to,
    vnode
  }
}

export function renderAttributes (
  context: RenderContext,
  key: string,
  data: TODO,
  config: TODO = {}
): void {
  // console.info('renderAttributes', key, data, config)

  const { attributesFor } = config

  if (!cachedElements[attributesFor]) {
    const el = document.querySelector(attributesFor)

    if (el) {
      cachedElements[attributesFor] = {
        el,
        attrs: []
      }
    }
  }

  const { el, attrs } = cachedElements[attributesFor]

  for (const attr in data) {
    const content = getSlotContent(context, `${key}(${attr})`, data[attr], data)

    el.setAttribute(attr, `${content || ''}`)

    if (!attrs.includes(attr)) {
      attrs.push(attr)
    }
  }

  const attrsToRemove = attrs.filter(attr => !data[attr])
  for (const attr of attrsToRemove) {
    el.removeAttribute(attr)
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
