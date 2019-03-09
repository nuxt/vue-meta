import Browser from '../utils/browser'
import { buildFixture } from '../utils/build'

const browser = new Browser()

describe('basic browser with ssr page', () => {
  let page = null
  let url
  let html

  beforeAll(async () => {
    const fixture = await buildFixture('basic')
    url = fixture.url
    html = fixture.html

    await browser.start({
      // slowMo: 50,
      // headless: false
    })
  })

  // Stop browser
  afterAll(async () => {
    if (page) await page.close()
    await browser.close()
  })

  test('validate ssr', () => {
    const htmlTag = html.match(/<html([^>]+)>/)[0]
    expect(htmlTag).toContain('data-vue-meta-server-rendered')
    expect(htmlTag).toContain(' lang="en" ')
    expect(htmlTag).toContain(' amp ')
    expect(htmlTag).not.toContain('allowfullscreen')
    expect(html.match(/<title[^>]*>(.*?)<\/title>/)[1]).toBe('Home | Vue Meta Test')
    expect(html.match(/<meta/g).length).toBe(2)
    expect(html.match(/<meta/g).length).toBe(2)

    const re = /<(no)?script[^>]+type="application\/ld\+json"[^>]*>(.*?)</g
    const sanitizeCheck = []
    let match
    while ((match = re.exec(html))) {
      sanitizeCheck.push(match[2])
    }

    expect(sanitizeCheck.length).toBe(3)
    expect(() => JSON.parse(sanitizeCheck[0])).not.toThrow()
    expect(() => JSON.parse(sanitizeCheck[1])).toThrow()
    expect(() => JSON.parse(sanitizeCheck[2])).not.toThrow()
  })

  test('Open /', async () => {
    page = await browser.page(url)

    expect(await page.$attr('html', 'data-vue-meta-server-rendered')).toBe(null)
    expect(await page.$attr('html', 'lang')).toBe('en')
    expect(await page.$attr('html', 'amp')).toBe('')
    expect(await page.$attr('html', 'allowfullscreen')).toBe(null)
    expect(await page.$attr('head', 'test')).toBe('true')
    expect(await page.$text('h1')).toBe('Basic')
    expect(await page.$text('title')).toBe('Home | Vue Meta Test')
    expect(await page.$$eval('meta', metas => metas.length)).toBe(2)

    let sanitizeCheck = await page.$$text('script')
    sanitizeCheck.push(...(await page.$$text('noscript')))
    sanitizeCheck = sanitizeCheck.filter(v => !!v)

    expect(sanitizeCheck.length).toBe(3)
    expect(() => JSON.parse(sanitizeCheck[0])).not.toThrow()
    expect(() => JSON.parse(sanitizeCheck[1])).not.toThrow()
    expect(() => JSON.parse(sanitizeCheck[2])).not.toThrow()
  })

  test('/about', async () => {
    const { hook } = await page.vueMeta.navigate('/about', false)
    await hook
    expect(await page.$text('title')).toBe('About')
    expect(await page.$$eval('meta', metas => metas.length)).toBe(1)
  })
})
