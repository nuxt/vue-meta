import { buildFixture } from '../utils/build'

describe('basic browser with ssr page', () => {
  let html

  beforeAll(async () => {
    const fixture = await buildFixture('basic')
    html = fixture.html
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
})
