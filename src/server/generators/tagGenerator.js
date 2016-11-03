import { VUE_META_ATTRIBUTE } from '../../shared/constants'

/**
 * Generates meta, base, link, style, script, noscript tags for use on the server
 *
 * @param  {('meta'|'base'|'link'|'style'|'script'|'noscript')} the name of the tag
 * @param  {(Array<Object>|Object)} tags - an array of tag objects or a single object in case of base
 * @return {Object} - the tag generator
 */
export default function tagGenerator (type, tags) {
  return {
    text () {
      // build a string containing all tags of this type
      return tags.reduce((tagsStr, tag) => {
        // build a string containing all attributes of this tag
        const attrs = Object.keys(tag).reduce((attrsStr, attr) => {
          switch (attr) {
            // these attributes are treated as children on the tag
            case 'innerHTML':
            case 'cssText':
              return attrsStr

            // these form the attribute list for this tag
            default:
              return typeof tag[attr] === 'undefined'
                ? `${attrsStr} ${attr}`
                : `${attrsStr} ${attr}="${tag[attr]}"`
          }
        }, '').trim()

        // grab child content from one of these attributes, if possible
        const content = tag.innerHTML || tag.cssText || ''

        // these tag types will have content inserted
        const closed = ['noscript', 'script', 'style'].indexOf(type) === -1

        // the final string for this specific tag
        return closed
          ? `${tagsStr}<${type} ${VUE_META_ATTRIBUTE}="true" ${attrs}/>`
          : `${tagsStr}<${type} ${VUE_META_ATTRIBUTE}="true" ${attrs}>${content}</${type}>`
      }, '')
    }
  }
}
