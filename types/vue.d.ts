/**
 * Augment the typings of Vue.js
 */

import Vue, { ComponentOptions } from 'vue'
import { MetaInfo, VueMetaPlugin } from './vue-meta'

declare module 'vue/types/vue' {
  interface Vue {
    $meta(): VueMetaPlugin
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    metaInfo?: MetaInfo | (() => MetaInfo)
  }
}

