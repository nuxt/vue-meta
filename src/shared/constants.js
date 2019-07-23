/**
 * These are constant variables used throughout the application.
 */

// set some sane defaults
export const defaultInfo = {
  title: undefined,
  titleChunk: '',
  titleTemplate: '%s',
  htmlAttrs: {},
  bodyAttrs: {},
  headAttrs: {},
  base: [],
  link: [],
  meta: [],
  style: [],
  script: [],
  noscript: [],
  __dangerouslyDisableSanitizers: [],
  __dangerouslyDisableSanitizersByTagID: {}
}

// This is the name of the component option that contains all the information that
// gets converted to the various meta tags & attributes for the page.
export const keyName = 'metaInfo'

// This is the attribute vue-meta arguments on elements to know which it should
// manage and which it should ignore.
export const attribute = 'data-vue-meta'

// This is the attribute that goes on the `html` tag to inform `vue-meta`
// that the server has already generated the meta tags for the initial render.
export const ssrAttribute = 'data-vue-meta-server-rendered'

// This is the property that tells vue-meta to overwrite (instead of append)
// an item in a tag list. For example, if you have two `meta` tag list items
// that both have `vmid` of "description", then vue-meta will overwrite the
// shallowest one with the deepest one.
export const tagIDKeyName = 'vmid'

// This is the key name for possible meta templates
export const metaTemplateKeyName = 'template'

// This is the key name for the content-holding property
export const contentKeyName = 'content'

// The id used for the ssr app
export const ssrAppId = 'ssr'

export const defaultOptions = {
  keyName,
  attribute,
  ssrAttribute,
  tagIDKeyName,
  contentKeyName,
  metaTemplateKeyName,
  ssrAppId
}

// List of metaInfo property keys which are configuration options (and dont generate html)
export const metaInfoOptionKeys = [
  'titleChunk',
  'titleTemplate',
  'changed',
  '__dangerouslyDisableSanitizers',
  '__dangerouslyDisableSanitizersByTagID'
]

// The metaInfo property keys which are used to disable escaping
export const disableOptionKeys = [
  '__dangerouslyDisableSanitizers',
  '__dangerouslyDisableSanitizersByTagID'
]

// List of metaInfo property keys which only generates attributes and no tags
export const metaInfoAttributeKeys = [
  'htmlAttrs',
  'headAttrs',
  'bodyAttrs'
]

// HTML elements which support the onload event
export const tagsSupportingOnload = ['link', 'style', 'script']

// HTML elements which dont have a head tag (shortened to our needs)
// see: https://www.w3.org/TR/html52/document-metadata.html
export const tagsWithoutEndTag = ['base', 'meta', 'link']

// HTML elements which can have inner content (shortened to our needs)
export const tagsWithInnerContent = ['noscript', 'script', 'style']

// Attributes which are inserted as childNodes instead of HTMLAttribute
export const tagAttributeAsInnerContent = ['innerHTML', 'cssText']

// Attributes which should be added with data- prefix
export const commonDataAttributes = ['body', 'pbody']

// from: https://github.com/kangax/html-minifier/blob/gh-pages/src/htmlminifier.js#L202
export const booleanHtmlAttributes = [
  'allowfullscreen',
  'amp',
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

// eslint-disable-next-line no-console
export const showWarningNotSupported = () => console.warn('This vue app/component has no vue-meta configuration')
