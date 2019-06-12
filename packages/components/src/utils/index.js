export const variantProps = {
  html: {
    type: Boolean,
    default: true
  },
  og: Boolean,
  twitter: Boolean,
  website: Boolean
}

export function createComponent({
  tag = 'meta',
  attrs = {},
  valueAttribute
} = {}) {
  return {
    functional: true,
    props: {
      value: String,
      ...variantProps
    },
    render(h, { data, props }) {
      let vAttr = null
      if (valueAttribute) {
        vAttr = { [valueAttribute]: props.value }
      }

      data.attrs = {
        ...data.attrs,
        ...attrs,
        ...vAttr
      }

      return h(tag, data, valueAttribute ? undefined : props.value)
    }
  }
}

export function createMetaComponent(options) {
  if (!options.hasOwnProperty('valueAttribute')) {
    options.valueAttribute = 'content'
  }

  return createComponent({
    ...options,
    tag: 'meta'
  })
}
