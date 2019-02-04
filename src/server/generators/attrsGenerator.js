export default function _attrsGenerator (options = {}) {
  const { attribute } = options

  // from: https://github.com/kangax/html-minifier/blob/gh-pages/src/htmlminifier.js#L202
  const booleanAttributes = [
    'allowfullscreen',
    'async',
    'autofocus',
    'autoplay',
    'checked',
    'compact',
    'controls',
    'declare',
    'default',
    'defaultchecked',
    'defaultmuted',
    'defaultselected',
    'defer',
    'disabled',
    'enabled',
    'formnovalidate',
    'hidden',
    'indeterminate',
    'inert',
    'ismap',
    'itemscope',
    'loop',
    'multiple',
    'muted',
    'nohref',
    'noresize',
    'noshade',
    'novalidate',
    'nowrap',
    'open',
    'pauseonexit',
    'readonly',
    'required',
    'reversed',
    'scoped',
    'seamless',
    'selected',
    'sortable',
    'truespeed',
    'typemustmatch',
    'visible'
  ]

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
              typeof data[attr] !== 'undefined' && !booleanAttributes.includes(attr)
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
