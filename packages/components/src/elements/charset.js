import { createComponent, variantProps } from '../utils'

export const charset = {
  functional: true,
  props: {
    value: String
  },
  render(h, { data, props }) {
    data.attrs = {
      ...data.attrs,
      charset: props.value
    }

    return h('meta', data)
  }
}
