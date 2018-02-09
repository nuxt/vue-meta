import './vue';
import { PluginFunction } from 'vue/types/plugin';

/**
 * Installation function
 *
 * @param {Vue} Vue - the Vue constructor.
 * @param {{
 *   keyName: string, // the component option name that vue-meta looks for meta info on.
 *   attribute: string, // the attribute name vue-meta adds to the tags it observes
 *   ssrAttribute: string, // the attribute name that lets vue-meta know that meta info has already been server-rendered
 *   tagIDKeyName: string // the property name that vue-meta uses to determine whether to overwrite or append a tag
 * }} options
 */
declare const Meta: PluginFunction<{
  keyName: string, // the component option name that vue-meta looks for meta info on.
  attribute: string, // the attribute name vue-meta adds to the tags it observes
  ssrAttribute: string, // the attribute name that lets vue-meta know that meta info has already been server-rendered
  tagIDKeyName: string // the property name that vue-meta uses to determine whether to overwrite or append a tag
}>;

export default Meta;

export interface MetaInfo {
  title?: string
  titleTemplate?: string | ((titleChunk: string) => string)
  htmlAttrs?: { [key: string]: string }
  bodyAttrs?: { [key: string]: string }
  base?: { target: string, href: string }

  meta?: {
    vmid?: string,
    charset?: string,
    content?: string,
    'http-equiv'?: 'content-security-policy' | 'refresh',
    name?: string,
      [key: string]: any
  }[]

  link?: { rel: string, href: string, [key: string]: any }[]
  style?: { cssText: string, type: string, [key: string]: any }[]
  script?: { innerHTML: string, type: string, [key: string]: any }[]
  noscript?: { innerHTML: string, [key: string]: any }[]

  __dangerouslyDisableSanitizers?: string[]
  __dangerouslyDisableSanitizersByTagID?: string[]

  changed?: <T extends object>(newInfo: T, addedTags: HTMLElement[], removedTags: HTMLElement[]) => void
}
