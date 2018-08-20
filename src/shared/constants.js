/**
 * These are constant variables used throughout the application.
 */

// This is the name of the component option that contains all the information that
// gets converted to the various meta tags & attributes for the page.
export const VUE_META_KEY_NAME = 'metaInfo'

// This is the attribute vue-meta augments on elements to know which it should
// manage and which it should ignore.
export const VUE_META_ATTRIBUTE = 'data-vue-meta'

// This is the attribute that goes on the `html` tag to inform `vue-meta`
// that the server has already generated the meta tags for the initial render.
export const VUE_META_SERVER_RENDERED_ATTRIBUTE = 'data-vue-meta-server-rendered'

// This is the property that tells vue-meta to overwrite (instead of append)
// an item in a tag list. For example, if you have two `meta` tag list items
// that both have `vmid` of "description", then vue-meta will overwrite the
// shallowest one with the deepest one.
export const VUE_META_TAG_LIST_ID_KEY_NAME = 'vmid'

// This is the key name for possible meta templates
export const VUE_META_TEMPLATE_KEY_NAME = 'template'

// This is the key name for the content-holding property
export const VUE_META_CONTENT_KEY = 'content'
