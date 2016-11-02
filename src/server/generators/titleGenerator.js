import { VUE_META_ATTRIBUTE } from '../../shared/constants'

/**
 * Generates title output for the server
 *
 * @param  {'title'} type - the string "title"
 * @param  {String} data - the title text
 * @return {Object} - the title generator
 */
export default function titleGenerator (type, data) {
  return {
    text () {
      return `<${type} ${VUE_META_ATTRIBUTE}="true">${data}</${type}>`
    }
  }
}
