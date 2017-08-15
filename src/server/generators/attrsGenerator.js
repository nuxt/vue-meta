export default function _attrsGenerator (options = {}) {
  const { attribute } = options

  /**
   * Generates tag attributes for use on the server.
   *
   * @param  {('bodyAttrs'|'htmlAttrs'|'headAttrs')} type - the type of attributes to generate
   * @param  {Object} data - the attributes to generate
   * @return {Object} - the attribute generator
   */
  return function attrsGenerator (type, data) {
    return {
      text () {
        let attributeStr = ''
        let watchedAttrs = []
        for (let attr in data) {
          if (data.hasOwnProperty(attr)) {
            watchedAttrs.push(attr)
            attributeStr += `${
              typeof data[attr] !== 'undefined'
                ? `${attr}="${data[attr]}"`
                : attr
            } `
          }
        }
        attributeStr += `${attribute}="${watchedAttrs.join(',')}"`
        return attributeStr.trim()
      }
    }
  }
}
