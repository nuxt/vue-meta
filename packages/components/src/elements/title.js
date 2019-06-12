import { createComponent, variantProps } from '../utils'

function createTitleComponent({ tag = 'meta', namePrefix = '', nameAttribute = 'name' } = {}) {
  const isHtmlTitle = tag === 'title'

  return createComponent({
    tag,
    valueAttribute: isHtmlTitle ? undefined : 'content',
    attrs: isHtmlTitle ? undefined : {
      [nameAttribute]: `${namePrefix}${namePrefix ? ':' : ''}title`
    }
  })
}

export const htmlTitle = createTitleComponent({ tag: 'title' })

export const ogTitle = createTitleComponent({ namePrefix: 'og' })

export const twitterTitle = createTitleComponent({ namePrefix: 'twitter' })

export const websiteTitle = createTitleComponent({ nameAttribute: 'itemprop' })

export const variants = {
  html: htmlTitle,
  og: ogTitle,
  twitter: twitterTitle,
  website: websiteTitle
}

export const title = {
  ...createComponent(),
  render(h, { data, props }) {
    return Object.keys(variantProps)
      .filter(variant => props[variant] && !!variants[variant])
      .map(variant => h(variants[variant], {
        ...data,
        props: { ...props }
      }))
  }
}
