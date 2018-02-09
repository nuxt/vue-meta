/**
 * Augment the typings of Vue.js
 */

import Vue, { ComponentOptions } from "vue";
import { MetaInfo } from './index';

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    metaInfo?: MetaInfo | (() => MetaInfo)
  }
}

declare module "vue/types/vue" {
  interface Vue {
    metaInfo?: MetaInfo | (() => MetaInfo)
  }
}
