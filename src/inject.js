import getMetaInfo from './getMetaInfo'
import generateServerInjector from './generateServerInjector'

/**
 * Converts the state of the meta info object such that each item
 * can be compiled to a tag string on the server
 *
 * @this {Object} - Vue instance - ideally the root component
 * @return {Object} - server meta info with `toString` methods
 */
export default function inject () {
  const info = getMetaInfo(this.$root)
  const serverMetaInfo = {}
  for (let key in info) {
    if (info.hasOwnProperty(key) && key !== 'titleTemplate') {
      serverMetaInfo[key] = generateServerInjector(key, info[key])
    }
  }
  return serverMetaInfo
}
