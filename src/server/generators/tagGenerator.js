export default function _tagGenerator (options = {}) {
  const { attribute } = options

  /**
   * Generates meta, base, link, style, script, noscript tags for use on the server
   *
   * @param  {('meta'|'base'|'link'|'style'|'script'|'noscript')} the name of the tag
   * @param  {(Array<Object>|Object)} tags - an array of tag objects or a single object in case of base
   * @return {Object} - the tag generator
   */
  return function tagGenerator (type, tags) {
    return {
      text ({ body = false } = {}) {
        // build a string containing all tags of this type
        return tags.reduce((tagsStr, tag) => {
          if (!!tag.body !== body) return tagsStr
          // build a string containing all attributes of this tag
          const attrs = Object.keys(tag).reduce((attrsStr, attr) => {
            switch (attr) {
              // these attributes are treated as children on the tag
              case 'innerHTML':
              case 'cssText':
              case 'once':
                return attrsStr
              // these form the attribute list for this tag
              default:
                if ([options.tagIDKeyName, 'body'].indexOf(attr) !== -1) {
                  return `${attrsStr} data-${attr}="${tag[attr]}"`
                }
                return typeof tag[attr] === 'undefined'
                  ? `${attrsStr} ${attr}`
                  : `${attrsStr} ${attr}="${tag[attr]}"`
            }
          }, '').trim()

          // grab child content from one of these attributes, if possible
          const content = tag.innerHTML || tag.cssText || ''

          // these tag types will have content inserted
          const closed = ['noscript', 'script', 'style'].indexOf(type) === -1

          // generate tag exactly without any other redundant attribute
          const observeTag = tag.once
            ? ''
            : `${attribute}="true" `

          // the final string for this specific tag
          return closed
            ? `${tagsStr}<${type} ${observeTag}${attrs}/>`
            : `${tagsStr}<${type} ${observeTag}${attrs}>${content}</${type}>`
        }, '')
      }
    }
  }
}
