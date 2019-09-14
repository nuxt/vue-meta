/**
 * Generates title output for the server
 *
 * @param  {'title'} type - the string "title"
 * @param  {String} data - the title text
 * @return {Object} - the title generator
 */
export default function titleGenerator (options, type, data, generatorOptions) {
  const { ln } = generatorOptions || {}

  if (!data) {
    return ''
  }

  return `<${type}>${data}</${type}>${ln ? '\n' : ''}`
}
