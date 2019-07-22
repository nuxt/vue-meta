/**
 * @jest-environment node
 */
import fs from 'fs'
import path from 'path'
import env from 'node-env-file'
import { createBrowser } from 'tib'

const browserString = process.env.BROWSER_STRING || 'puppeteer/core'

describe(browserString, () => {
  let browser
  let page
  const folder = path.resolve(__dirname, '..', 'fixtures/basic/.vue-meta/')

  beforeAll(async () => {
    if (browserString.includes('browserstack') && browserString.includes('local')) {
      const envFile = path.resolve(__dirname, '..', '..', '.env-browserstack')
      if (fs.existsSync(envFile)) {
        env(envFile)
      }
    }

    browser = await createBrowser(browserString, {
      staticServer: {
        folder
      },
      extendPage (page) {
        return {
          async navigate (path) {
            // IMPORTANT: use (arrow) function with block'ed body
            // see: https://github.com/tunnckoCoreLabs/parse-function/issues/179
            await page.runAsyncScript((path) => {
              return new Promise((resolve) => {
                const oldTitle = document.title

                // local firefox has sometimes not updated the title
                // even when the DOM is supposed to be fully updated
                const waitTitleChanged = function () {
                  setTimeout(function () {
                    if (oldTitle !== document.title) {
                      resolve()
                    } else {
                      waitTitleChanged()
                    }
                  }, 50)
                }

                window.$vueMeta.$once('routeChanged', waitTitleChanged)
                window.$vueMeta.$router.push(path)
              })
            }, path)
          },
          routeData () {
            return page.runScript(() => ({
              path: window.$vueMeta.$route.path,
              query: window.$vueMeta.$route.query
            }))
          }
        }
      }
    })

    // browser.setLogLevel(['warn', 'error', 'log', 'info'])
  })

  afterAll(async () => {
    if (browser) {
      await browser.close()
    }
  })

  test('open page', async () => {
    const url = browser.getUrl('/index.html')

    page = await browser.page(url)

    expect(await page.getAttribute('html', 'data-vue-meta-server-rendered')).toBe(null)
    expect(await page.getAttribute('html', 'lang')).toBe('en')
    expect(await page.getAttribute('html', 'amp')).toBe('')
    expect(await page.getAttribute('html', 'allowfullscreen')).toBe(null)
    expect(await page.getAttribute('head', 'test')).toBe('true')
    expect(await page.getText('h1')).toBe('Basic')
    expect(await page.getText('title')).toBe('Home | Vue Meta Test')
    expect(await page.getElementCount('meta')).toBe(2)

    let sanitizeCheck = await page.getTexts('script')
    sanitizeCheck.push(...(await page.getTexts('noscript')))
    sanitizeCheck = sanitizeCheck.filter(v => !!v)

    expect(sanitizeCheck.length).toBe(4)
    expect(() => JSON.parse(sanitizeCheck[0])).not.toThrow()
    // TODO: check why this doesnt Throw when Home is dynamic loaded
    // (but that causes hydration error)
    expect(() => JSON.parse(sanitizeCheck[1])).toThrow()
    expect(() => JSON.parse(sanitizeCheck[2])).not.toThrow()
    expect(() => JSON.parse(sanitizeCheck[3])).not.toThrow()

    expect(await page.getElementCount('body noscript:first-child')).toBe(1)
    expect(await page.getElementCount('body noscript:last-child')).toBe(1)

    expect(await page.runScript(() => {
      return window.loadTest
    })).toBe('loaded')

    expect(await page.runScript(() => {
      return window.loadCallback
    })).toBe('yes')
  })

  test('/about', async () => {
    try {
      await page.navigate('/about', false)
    } catch (e) {
      if (e.constructor.name !== 'ScriptTimeoutError') {
        throw e
      } else {
        console.warn(e) // eslint-disable-line no-console
      }
    }

    expect(await page.getText('title')).toBe('About')
    expect(await page.getElementCount('meta')).toBe(1)
  })
})
