import { createComponent, variantProps } from '../utils'

export function createDescriptionComponent({ namePrefix = '', nameAttribute = 'name' } = {}) {
  return createComponent({
    valueAttribute: 'content',
    attrs: {
      [nameAttribute]: `${namePrefix}${namePrefix ? ':' : ''}description`
    }
  })
}

export const htmlDescription = createDescriptionComponent()

export const ogDescription = createDescriptionComponent({ namePrefix: 'og' })

export const twitterDescription = createDescriptionComponent({ namePrefix: 'twitter' })

export const websiteDescription = createDescriptionComponent({ nameAttribute: 'itemprop' })

export const variants = {
  html: htmlDescription,
  og: ogDescription,
  twitter: twitterDescription,
  website: websiteDescription
}

export const description = {
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
