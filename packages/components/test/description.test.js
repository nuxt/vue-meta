import { renderToString } from '@vue/server-test-utils'
import * as descriptions from '../src/elements/description'

const renderOptions = {
  propsData: {
    value: 'test'
  }
}

test('description', async () => {
  const str = await renderToString(descriptions.htmlDescription, renderOptions)
  expect(str).toMatchSnapshot()
})

test('og-description', async () => {
  const str = await renderToString(descriptions.ogDescription, renderOptions)
  expect(str).toMatchSnapshot()
})

test('twitter-description', async () => {
  const str = await renderToString(descriptions.twitterDescription, renderOptions)
  expect(str).toMatchSnapshot()
})

test('website-description', async () => {
  const str = await renderToString(descriptions.websiteDescription, renderOptions)
  expect(str).toMatchSnapshot()
})

test('description:html', async () => {
  const str = await renderToString(descriptions.description, {
    ...renderOptions,
    propsData: {
      ...renderOptions.propsData,
      html: true
    }
  })
  expect(str).toMatchSnapshot()
})

test('description:og', async () => {
  const str = await renderToString(descriptions.description, {
    ...renderOptions,
    propsData: {
      ...renderOptions.propsData,
      html: false,
      og: true
    }
  })
  expect(str).toMatchSnapshot()
})

test('description:twitter', async () => {
  const str = await renderToString(descriptions.description, {
    ...renderOptions,
    propsData: {
      ...renderOptions.propsData,
      html: false,
      twitter: true
    }
  })
  expect(str).toMatchSnapshot()
})

test('description:website', async () => {
  const str = await renderToString(descriptions.description, {
    ...renderOptions,
    propsData: {
      ...renderOptions.propsData,
      html: false,
      website: true
    }
  })
  expect(str).toMatchSnapshot()
})
