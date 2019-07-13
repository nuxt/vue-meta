import puppeteer from 'puppeteer-core'

import ChromeDetector from './chrome'

export default class Browser {
  constructor () {
    this.detector = new ChromeDetector()
  }

  async start (options = {}) {
    // https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions
    const _opts = {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      ...options
    }

    if (!_opts.executablePath) {
      _opts.executablePath = this.detector.detect()
    }

    this.browser = await puppeteer.launch(_opts)
  }

  async close () {
    if (!this.browser) { return }
    await this.browser.close()
  }

  async page (url, globalName = 'vueMeta') {
    if (!this.browser) { throw new Error('Please call start() before page(url)') }
    const page = await this.browser.newPage()

    // pass on console messages
    const typeMap = {
      debug: 'debug',
      warning: 'warn',
      error: 'error'
    }
    page.on('console', (msg) => {
      if (typeMap[msg.type()]) {
        console[typeMap[msg.type()]](msg.text()) // eslint-disable-line no-console
      }
    })

    await page.goto(url)
    page.$globalHandle = `window.$${globalName}`
    await page.waitForFunction(`!!${page.$globalHandle}`)
    page.html = () => page.evaluate(() => window.document.documentElement.outerHTML)
    page.$text = (selector, trim) => page.$eval(selector, (el, trim) => {
      return trim ? el.textContent.replace(/^\s+|\s+$/g, '') : el.textContent
    }, trim)
    page.$$text = (selector, trim) =>
      page.$$eval(selector, (els, trim) => els.map((el) => {
        return trim ? el.textContent.replace(/^\s+|\s+$/g, '') : el.textContent
      }), trim)
    page.$attr = (selector, attr) =>
      page.$eval(selector, (el, attr) => el.getAttribute(attr), attr)
    page.$$attr = (selector, attr) =>
      page.$$eval(
        selector,
        (els, attr) => els.map(el => el.getAttribute(attr)),
        attr
      )

    page.$vueMeta = await page.evaluateHandle(page.$globalHandle)

    page.vueMeta = {
      async navigate (path, waitEnd = true) {
        const hook = page.evaluate(`
          new Promise(resolve =>
            ${page.$globalHandle}.$once('routeChanged', resolve)
          ).then(() => new Promise(resolve => setTimeout(resolve, 50)))
        `)
        await page.evaluate(
          ($vueMeta, path) => $vueMeta.$router.push(path),
          page.$vueMeta,
          path
        )
        if (waitEnd) {
          await hook
        }
        return { hook }
      },
      routeData () {
        return page.evaluate(($vueMeta) => {
          return {
            path: $vueMeta.$route.path,
            query: $vueMeta.$route.query
          }
        }, page.$vueMeta)
      }
    }
    return page
  }
}
