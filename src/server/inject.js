import getMetaInfo from '../shared/getMetaInfo'
import generateServerInjector from './generateServerInjector'

/**
 * Converts the state of the meta info object such that each item
 * can be compiled to a tag string on the server
 *
 * @this {Object} - Vue instance - ideally the root component
 * @return {Object} - server meta info with `toString` methods
 */
export default function inject () {
  const Vue = this.constructor

  // get meta info with sensible defaults
  const info = Vue.util.extend({
    title: '',
    htmlAttrs: {},
    bodyAttrs: {},
    meta: [],
    script: [],
    noscript: [],
    style: [],
    link: [],
    base: {}
  }, getMetaInfo(this.$root))

  // generate server injectors
  for (let key in info) {
    if (info.hasOwnProperty(key) && key !== 'titleTemplate') {
      info[key] = generateServerInjector(key, info[key])
    }
  }

  return info
}
