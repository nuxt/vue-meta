import {
  booleanHtmlAttributes,
  tagsWithoutEndTag,
  tagsWithInnerContent,
  tagAttributeAsInnerContent,
  commonDataAttributes
} from '../../shared/constants'

/**
 * Generates meta, base, link, style, script, noscript tags for use on the server
 *
 * @param  {('meta'|'base'|'link'|'style'|'script'|'noscript')} the name of the tag
 * @param  {(Array<Object>|Object)} tags - an array of tag objects or a single object in case of base
 * @return {Object} - the tag generator
 */
export default function tagGenerator ({ ssrAppId, attribute, tagIDKeyName } = {}, type, tags) {
  const dataAttributes = [tagIDKeyName, 'callback', ...commonDataAttributes]

  return {
    text ({ body = false, pbody = false } = {}) {
      // build a string containing all tags of this type
      return tags.reduce((tagsStr, tag) => {
        if (tag.skip) {
          return tagsStr
        }

        const tagKeys = Object.keys(tag)

        if (tagKeys.length === 0) {
          return tagsStr // Bail on empty tag object
        }

        if (Boolean(tag.body) !== body || Boolean(tag.pbody) !== pbody) {
          return tagsStr
        }

        let attrs = tag.once ? '' : ` ${attribute}="${ssrAppId}"`

        // build a string containing all attributes of this tag
        for (const attr in tag) {
          // these attributes are treated as children on the tag
          if (tagAttributeAsInnerContent.includes(attr) || attr === 'once') {
            continue
          }

          // these form the attribute list for this tag
          let prefix = ''
          if (dataAttributes.includes(attr)) {
            prefix = 'data-'
          }

          if (attr === 'callback') {
            attrs += ` onload="this.__vm_l=1"`
            continue
          }

          const isBooleanAttr = !prefix && booleanHtmlAttributes.includes(attr)
          if (isBooleanAttr && !tag[attr]) {
            continue
          }

          attrs += ` ${prefix}${attr}` + (isBooleanAttr ? '' : `="${tag[attr]}"`)
        }

        // grab child content from one of these attributes, if possible
        const content = tag.innerHTML || tag.cssText || ''

        // generate tag exactly without any other redundant attribute

        // these tags have no end tag
        const hasEndTag = !tagsWithoutEndTag.includes(type)

        // these tag types will have content inserted
        const hasContent = hasEndTag && tagsWithInnerContent.includes(type)

        // the final string for this specific tag
        return `${tagsStr}<${type}${attrs}${!hasContent && hasEndTag ? '/' : ''}>` +
          (hasContent ? `${content}</${type}>` : '')
      }, '')
    }
  }
}
