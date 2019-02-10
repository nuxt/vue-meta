/**
 * Generates tag attributes for use on the server.
 *
 * @param  {('bodyAttrs'|'htmlAttrs'|'headAttrs')} type - the type of attributes to generate
 * @param  {Object} data - the attributes to generate
 * @return {Object} - the attribute generator
 */
export default function attributeGenerator({ attribute } = {}, type, data) {
  return {
    text() {
      let attributeStr = ''
      const watchedAttrs = []

      for (const attr in data) {
        if (data.hasOwnProperty(attr)) {
          watchedAttrs.push(attr)

          attributeStr += typeof data[attr] !== 'undefined'
            ? `${attr}="${data[attr]}"`
            : attr

          attributeStr += ' '
        }
      }

      attributeStr += `${attribute}="${(watchedAttrs.sort()).join(',')}"`
      return attributeStr
    }
  }
}