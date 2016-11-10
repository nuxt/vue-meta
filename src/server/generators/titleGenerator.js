export default function _titleGenerator (options = {}) {
  const { attribute } = options

  /**
   * Generates title output for the server
   *
   * @param  {'title'} type - the string "title"
   * @param  {String} data - the title text
   * @return {Object} - the title generator
   */
  return function titleGenerator (type, data) {
    return {
      text () {
        return `<${type} ${attribute}="true">${data}</${type}>`
      }
    }
  }
}
