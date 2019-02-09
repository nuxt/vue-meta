/**
 * Generates meta, base, link, style, script, noscript tags for use on the server
 *
 * @param  {('meta'|'base'|'link'|'style'|'script'|'noscript')} the name of the tag
 * @param  {(Array<Object>|Object)} tags - an array of tag objects or a single object in case of base
 * @return {Object} - the tag generator
 */
export default function tagGenerator({ attribute, tagIDKeyName } = {}, type, tags) {
  return {
    text({ body = false } = {}) {
      // build a string containing all tags of this type
      return tags.reduce((tagsStr, tag) => {
        if (Object.keys(tag).length === 0) {
          return tagsStr // Bail on empty tag object
        }

        if (Boolean(tag.body) !== body) {
          return tagsStr
        }

        // build a string containing all attributes of this tag
        const attrs = Object.keys(tag).reduce((attrsStr, attr) => {
          // these attributes are treated as children on the tag
          if (['innerHTML', 'cssText', 'once'].includes(attr)) {
            return attrsStr
          }

          // these form the attribute list for this tag
          let prefix = ''
          if ([tagIDKeyName, 'body'].includes(attr)) {
            prefix = 'data-'
          }

          return typeof tag[attr] === 'undefined'
            ? `${attrsStr} ${prefix}${attr}`
            : `${attrsStr} ${prefix}${attr}="${tag[attr]}"`
        }, '')

        // grab child content from one of these attributes, if possible
        const content = tag.innerHTML || tag.cssText || ''

        // generate tag exactly without any other redundant attribute
        const observeTag = tag.once
          ? ''
          : `${attribute}="true"`

        // these tags have no end tag
        const hasEndTag = !['base', 'meta', 'link'].includes(type)

        // these tag types will have content inserted
        const hasContent = hasEndTag && ['noscript', 'script', 'style'].includes(type)

        // the final string for this specific tag
        return !hasContent
          ? `${tagsStr}<${type} ${observeTag}${attrs}${hasEndTag ? '/' : ''}>`
          : `${tagsStr}<${type} ${observeTag}${attrs}>${content}</${type}>`
      }, '')
    }
  }
}
