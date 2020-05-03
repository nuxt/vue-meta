import { h } from 'vue'
import { getConfigKey } from './config'

export function renderMeta (ctx, key, data, config) {
  console.info('renderMeta', key, data, config)

  if (config.group) {
    return renderGroup(ctx, key, data, config)
  }

  return renderTag(ctx, key, data, config)
}

export function renderGroup (ctx, key, data, config) {
  console.info('renderGroup', key, data, config)

  if (Array.isArray(data)) {
    config.contentAttributes = getConfigKey([key, config.tag], 'contentAttributes', config)
    return data.map(_data => renderTag(ctx, key, _data, config))
  }

  return Object.keys(data).map((childKey) => {
    const groupConfig = {
      group: key,
      data
    }

    if (config.namespaced || config.namespacedAttribute) {
      let namespace
      if (config.namespaced) {
        namespace = config.namespaced === true ? key : config.namespaced
        groupConfig.tagNamespace = namespace
      } else {
        namespace = config.namespacedAttribute === true ? key : config.namespacedAttribute
        groupConfig.fullName = `${namespace}:${childKey}`
        groupConfig.slotName = `${namespace}(${childKey})`
      }
    }

    return renderTag(ctx, key, data[childKey], config, groupConfig)
  })
}

export function renderTag (ctx, key, data, config = {}, groupConfig = {}) {
  if (!config.group && Array.isArray(data)) {
    return renderTag(ctx, key, { content: data }, config, groupConfig)
  }

  const { tag = config.tag || key } = data
  const {
    slotName = key,
    fullName = key
  } = groupConfig

  let content, hasChilds

  if (Array.isArray(data)) {
    return data.map((child) => {
      return renderTag(ctx, key, child, config, groupConfig)
    })
  } else if (data.content && Array.isArray(data.content)) {
    content = data.content.map((child) => {
      if (typeof child === 'string') {
        return child
      }
      return renderTag(ctx, key, child, config, groupConfig)
    })
    hasChilds = true
  } else {
    content = data
  }

  let { attrs: attributes } = data
  if (!attributes && typeof data === 'object') {
    attributes = {
      ...data
    }
    delete attributes.tag
    delete attributes.content
    delete attributes.target
  } else {
    attributes = {}
  }

  if (hasChilds) {
    content = getSlotContent(ctx, slotName, content, config, data)
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
      attributes[contentAttribute] = getSlotContent(ctx, slotName, attributes[contentAttribute] || content, config, groupConfig)
      content = undefined
    } else {
      content = getSlotContent(ctx, slotName, content, config, data, true)
    }
  }

  const finalTag = groupConfig.tagNamespace
    ? `${groupConfig.tagNamespace}:${tag}`
    : tag

  console.info('FINAL TAG', finalTag)
  console.log('      ATTRIBUTES', attributes)
  console.log('      CONTENT', content)
  // console.log(data, attributes, config)

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

  if (data.target) {
    vnode.__vm_target = data.target
  }

  return vnode
}

export function getSlotContent ({ metainfo, $slots }, slotName, content, config, groupConfig) {
  if (!$slots[slotName]) {
    return content
  }

  const slotProps = {
    content,
    metainfo
  }

  if (groupConfig.group) {
    slotProps[groupConfig.group] = groupConfig.data
  }

  content = $slots[slotName](slotProps)
  return content[0].children
}
