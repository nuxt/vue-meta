import { isFunction } from '@vue/shared'
import { App, ComponentOptionsMixin, computed, getCurrentInstance } from 'vue'
import { ComponentOptionsMetaInfo } from './types/options'
import { useMeta } from './useApi'

export type PluginOptions = {
  keyName: string
}

export const defaultOptions: PluginOptions = {
  keyName: 'metaInfo'
}

type CreateMixin = (options: PluginOptions) => ComponentOptionsMixin
export const createMixin: CreateMixin = options => ({
  created () {
    const instance = getCurrentInstance()
    if (!instance?.type || !(options.keyName in instance.type)) {
      return
    }

    const metaInfo = (instance.type as any)[options.keyName] as ComponentOptionsMetaInfo
    if (isFunction(metaInfo)) {
      const computedMetaInfo = computed(metaInfo.bind(this))
      useMeta(computedMetaInfo)
    } else {
      useMeta(metaInfo)
    }
  }
})

export const install = (app: App, _options: Partial<PluginOptions> = {}) => {
  const options = Object.assign({}, defaultOptions, _options)
  app.mixin(createMixin(options))
}
