/**
 * Generates title output for the server
 *
 * @param  {'title'} type - the string "title"
 * @param  {String} data - the title text
 * @return {Object} - the title generator
 */
export default function titleGenerator ({ attribute } = {}, type, data, { ln } = {}) {
  if (!data) {
    return ''
  }

  return `<${type}>${data}</${type}>${ln ? '\n' : ''}`
}
