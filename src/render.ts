import { h } from 'vue'
import { isArray, isFunction, isString } from '@vue/shared'
import { getTagConfigItem } from './config'
import type {
  MetaConfigSectionAttribute,
  MetaConfigSectionGroup,
  MetaConfigSectionTag,
  MetaConfigSection,
  MetaGroupConfig,
  MetaRenderContext,
  MetaRenderedNode,
  MetaRendered,
  MetaTagConfigKey,
  SlotScopeProperties,
  TODO
} from './types'

const cachedElements: {
  [key: string]: {
    el: Element,
    attrs: Array<string>,
  }
} = {}

export function renderMeta (
  context: MetaRenderContext,
  key: string,
  data: TODO,
  config: MetaConfigSection
): void | MetaRendered | MetaRenderedNode {
  // console.info('renderMeta', key, data, config)

  if ('attributesFor' in config) {
    return renderAttributes(context, key, data, config as MetaConfigSectionAttribute)
  }

  if ('group' in config) {
    return renderGroup(context, key, data, config as MetaConfigSectionGroup)
  }

  return renderTag(context, key, data, config)
}

export function renderGroup (
  context: MetaRenderContext,
  key: string,
  data: TODO,
  config: MetaConfigSectionGroup
): MetaRendered | MetaRenderedNode {
  // console.info('renderGroup', key, data, config)

  if (isArray(data)) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn('Specifying an array for group properties isnt supported')
    }
    // config.attributes = getConfigKey([key, config.tag], 'attributes', config)
    return []
  }

  return Object.keys(data)
    .map((childKey) => {
      const groupConfig: MetaGroupConfig = {
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

      return renderTag(context, key, data[childKey], config as MetaConfigSectionTag, groupConfig)
    })
    .flat()
}

export function renderTag (
  context: MetaRenderContext,
  key: string,
  data: TODO,
  config: MetaConfigSectionTag = {},
  groupConfig?: MetaGroupConfig
): MetaRendered | MetaRenderedNode {
  // console.info('renderTag', key, data, config, groupConfig)

  const contentAttributes = ['content', 'json', 'rawContent']
  const getTagConfig = (key: MetaTagConfigKey) => getTagConfigItem([tag, config.tag], key)

  if (isArray(data)) {
    return data
      .map((child) => {
        return renderTag(context, key, child, config, groupConfig)
      })
      .flat()
  }

  const { tag = config.tag || key } = data

  let content: string = ''
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
    const contentAsAttribute = !!getTagConfig('contentAsAttribute')
    let { valueAttribute } = config

    if (!valueAttribute && contentAsAttribute) {
      const [tagAttribute] = getTagConfig('attributes')
      valueAttribute = isString(contentAsAttribute) ? contentAsAttribute : tagAttribute
    }

    if (!valueAttribute) {
      content = getSlotContent(context, slotName, content, data)
    } else {
      const { nameless, keyAttribute } = config
      if (!nameless) {
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

      content = ''
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

  if (isRaw && content) {
    attributes.innerHTML = content
  }

  // Ignore empty string content
  const vnode = h(finalTag, attributes, content || undefined)

  return {
    to: data.to,
    vnode
  }
}

export function renderAttributes (
  context: MetaRenderContext,
  key: string,
  data: TODO,
  config: MetaConfigSectionAttribute
): MetaRenderedNode | void {
  // console.info('renderAttributes', key, data, config)

  const { attributesFor } = config
  if (!attributesFor) {
    return
  }

  if (!__BROWSER__) {
    // render attributes in a placeholder vnode so Vue
    // will render the string for us
    return {
      to: '',
      vnode: h(`ssr-${attributesFor}`, data)
    }
  }

  if (!cachedElements[attributesFor]) {
    const [el, el2] = Array.from(document.querySelectorAll(attributesFor))

    if (__DEV__ && !el) {
      // eslint-disable-next-line no-console
      console.error('Could not find element for selector', attributesFor, ', won\'t render attributes')
      return
    }

    if (__DEV__ && el2) {
      // eslint-disable-next-line no-console
      console.warn('Found multiple elements for selector', attributesFor)
    }

    cachedElements[attributesFor] = {
      el,
      attrs: []
    }
  }

  const { el, attrs } = cachedElements[attributesFor]

  for (const attr in data) {
    const content = getSlotContent(context, `${key}(${attr})`, data[attr], data)

    el.setAttribute(attr, content || '')

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
  { metainfo, slots }: MetaRenderContext,
  slotName: string,
  content: string,
  groupConfig?: MetaGroupConfig
): string {
  const slot = slots && slots[slotName]
  if (!slot || !isFunction(slot)) {
    return content
  }

  const slotScopeProps: SlotScopeProperties = {
    content,
    metainfo
  }

  if (groupConfig && groupConfig.group) {
    const { group, data } = groupConfig
    slotScopeProps[group] = data
  }

  const slotContent = slot(slotScopeProps)

  if (slotContent && slotContent.length) {
    const { children } = slotContent[0]
    return children ? children.toString() : ''
  }

  return content
}
