export interface TagConfig {
  nameAttribute?: string
  contentAttributes: boolean | Array<string>
  [key: string]: any
}

const tags: { [key: string]: TagConfig } = {
  title: {
    contentAttributes: false,
  },
  base: {
    contentAttributes: ['href', 'target'],
  },
  meta: {
    nameAttribute: 'name',
    contentAttributes: ['content', 'name', 'http-equiv', 'charset'],
  },
  link: {
    contentAttributes: [
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
      'color',
    ],
  },
  style: {
    contentAttributes: ['media'],
  },
  script: {
    contentAttributes: [
      'src',
      'type',
      'nomodule',
      'async',
      'defer',
      'crossorigin',
      'integrity',
      'referrerpolicy',
    ],
  },
  noscript: {
    contentAttributes: false,
  },
}

export { tags }
