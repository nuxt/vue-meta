import getMetaInfo from '../shared/getMetaInfo'
import updateClientMetaInfo from './updateClientMetaInfo'

export default function _refresh (options = {}) {
  /**
   * When called, will update the current meta info with new meta info.
   * Useful when updating meta info as the result of an asynchronous
   * action that resolves after the initial render takes place.
   *
   * Credit to [Sébastien Chopin](https://github.com/Atinux) for the suggestion
   * to implement this method.
   *
   * @return {Object} - new meta info
   */
  /*
    * author： cqmimi
    * Accept the cache component object
  */
  return function refresh (component) {
    let info = null
    component ? info = getMetaInfo(options)(component) : info = getMetaInfo(options)(this.$root)
    updateClientMetaInfo(options)(info)
    return info
  }
}
