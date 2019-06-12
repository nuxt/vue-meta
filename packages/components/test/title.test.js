import { renderToString } from '@vue/server-test-utils'
import * as titles from '../src/elements/title'

const renderOptions = {
  propsData: {
    value: 'test'
  }
}

test('title', async () => {
  const str = await renderToString(titles.htmlTitle, renderOptions)
  expect(str).toMatchSnapshot()
})

test('og-title', async () => {
  const str = await renderToString(titles.ogTitle, renderOptions)
  expect(str).toMatchSnapshot()
})

test('twitter-title', async () => {
  const str = await renderToString(titles.twitterTitle, renderOptions)
  expect(str).toMatchSnapshot()
})

test('website-title', async () => {
  const str = await renderToString(titles.websiteTitle, renderOptions)
  expect(str).toMatchSnapshot()
})

test('title:html', async () => {
  const str = await renderToString(titles.title, {
    ...renderOptions,
    propsData: {
      ...renderOptions.propsData,
      html: true
    }
  })
  expect(str).toMatchSnapshot()
})

test('title:og', async () => {
  const str = await renderToString(titles.title, {
    ...renderOptions,
    propsData: {
      ...renderOptions.propsData,
      html: false,
      og: true
    }
  })
  expect(str).toMatchSnapshot()
})

test('title:twitter', async () => {
  const str = await renderToString(titles.title, {
    ...renderOptions,
    propsData: {
      ...renderOptions.propsData,
      html: false,
      twitter: true
    }
  })
  expect(str).toMatchSnapshot()
})

test('title:website', async () => {
  const str = await renderToString(titles.title, {
    ...renderOptions,
    propsData: {
      ...renderOptions.propsData,
      html: false,
      website: true
    }
  })
  expect(str).toMatchSnapshot()
})
