import { serverSequences } from '../shared/escaping'
import { getComponentMetaInfo } from '../shared/getComponentOption'
import getMetaInfo from '../shared/getMetaInfo'
import generateServerInjector from './generateServerInjector'

export default function _inject (options = {}) {
  /**
   * Converts the state of the meta info object such that each item
   * can be compiled to a tag string on the server
   *
   * @this {Object} - Vue instance - ideally the root component
   * @return {Object} - server meta info with `toString` methods
   */

  // collect & aggregate all metaInfo $options
  const rawInfo = getComponentMetaInfo(options, this.$root)

  const metaInfo = getMetaInfo(options, rawInfo, serverSequences, this.$root)

  // generate server injectors
  generateServerInjector(options, metaInfo)

  return metaInfo
}
