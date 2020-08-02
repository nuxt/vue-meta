/*
 * This is a fixed config for real HTML tags
 *
 * TODO: we probably dont need all attributes
 */

export interface TagConfig {
  keyAttribute?: string
  contentAsAttribute?: boolean | string
  attributes: boolean | Array<string>
  [key: string]: any
}

const tags: { [key: string]: TagConfig } = {
  title: {
    attributes: false
  },
  base: {
    contentAsAttribute: true,
    attributes: ['href', 'target']
  },
  meta: {
    contentAsAttribute: true,
    keyAttribute: 'name',
    attributes: ['content', 'name', 'http-equiv', 'charset']
  },
  link: {
    contentAsAttribute: true,
    attributes: [
      'href',
      'crossorigin',
      'rel',
      'media',
      'integrity',
      'hreflang',
      'type',
      'referrerpolicy',
      'sizes',
      'imagesrcset',
      'imagesizes',
      'as',
      'color'
    ]
  },
  style: {
    attributes: ['media']
  },
  script: {
    attributes: [
      'src',
      'type',
      'nomodule',
      'async',
      'defer',
      'crossorigin',
      'integrity',
      'referrerpolicy'
    ]
  },
  noscript: {
    attributes: false
  }
}

export { tags }
