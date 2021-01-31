
export type MetaConfigSectionKey = 'tag' | 'to' | 'keyAttribute' | 'valueAttribute' | 'nameless' | 'group' | 'namespaced' | 'namespacedAttribute' | 'attributesFor'

export interface MetaConfigSectionTag {
  tag?: string
  to?: string
  keyAttribute?: string
  valueAttribute?: string
  nameless?: boolean
}

export type MetaConfigSectionGroup = {
  group: boolean
  namespaced?: boolean
  namespacedAttribute?: boolean
}

export type MetaConfigSectionAttribute = {
  attributesFor: string
}

export type MetaConfigSection = MetaConfigSectionGroup | MetaConfigSectionTag | MetaConfigSectionAttribute

export interface MetaConfig {
  [key: string]: MetaConfigSection
}

export type MetaTagConfigKey = 'keyAttribute' | 'contentAsAttribute' | 'attributes'

export interface MetaTagConfig {
  keyAttribute?: string
  contentAsAttribute?: boolean | string
  attributes: boolean | Array<string>
}

export type MetaTagName = 'title' | 'base' | 'meta' | 'link' | 'style' | 'script' | 'noscript'

export type MetaTagsConfig = {
  [key in MetaTagName]: MetaTagConfig
}
