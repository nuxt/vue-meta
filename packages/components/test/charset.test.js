import { renderToString } from '@vue/server-test-utils'
import { charset } from '../src/elements/charset'

const renderOptions = {
  propsData: {
    value: 'utf-8'
  }
}

test('charset', async () => {
  const str = await renderToString(charset, renderOptions)
  expect(str).toMatchSnapshot()
})
