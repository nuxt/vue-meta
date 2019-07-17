import _generateServerInjector from '../../src/server/generateServerInjector'
import { defaultOptions } from '../../src/shared/constants'
import metaInfoData from '../utils/meta-info-data'
import { titleGenerator } from '../../src/server/generators'

defaultOptions.ssrAppId = 'test'

const generateServerInjector = (type, data) => _generateServerInjector(defaultOptions, type, data)

describe('generators', () => {
  for (const type in metaInfoData) {
    const typeTests = metaInfoData[type]

    const testCases = {
      add: (tags) => {
        let html = tags.text()

        // ssr only returns the attributes, convert to full tag
        if (['htmlAttrs', 'headAttrs', 'bodyAttrs'].includes(type)) {
          html = `<${type.substr(0, 4)} ${html}>`
        }

        typeTests.add.expect.forEach((expected) => {
          expect(html).toContain(expected)
        })
      }
    }

    describe(`${type} type tests`, () => {
      Object.keys(typeTests).forEach((action) => {
        const testInfo = typeTests[action]

        // return when no test case available
        if (!testCases[action] && !testInfo.test) {
          return
        }

        const defaultTestFn = () => {
          const tags = generateServerInjector(type, testInfo.data)
          testCases[action](tags)
          return tags
        }

        let testFn
        if (testInfo.test) {
          testFn = testInfo.test('server', defaultTestFn)

          if (testFn === true) {
            testFn = defaultTestFn
          }
        } else {
          testFn = defaultTestFn
        }

        if (testFn && typeof testFn === 'function') {
          test(`${action} a tag`, () => {
            expect.hasAssertions()
            testFn()
          })
        }
      })
    })
  }
})

describe('extra tests', () => {
  test('title generator should return an empty string when title is null', () => {
    const title = null
    const generatedTitle = titleGenerator({}, 'title', title)

    expect(generatedTitle.text()).toEqual('')
  })

  test('auto add ssrAttribute', () => {
    const htmlAttrs = generateServerInjector('htmlAttrs', {})
    expect(htmlAttrs.text(true)).toBe('data-vue-meta-server-rendered')

    const headAttrs = generateServerInjector('headAttrs', {})
    expect(headAttrs.text(true)).toBe('')

    const bodyAttrs = generateServerInjector('bodyAttrs', {})
    expect(bodyAttrs.text(true)).toBe('')
  })

  test('script prepend body', () => {
    const tags = [{ src: '/script.js', pbody: true }]
    const scriptTags = generateServerInjector('script', tags)

    expect(scriptTags.text()).toBe('')
    expect(scriptTags.text({ body: true })).toBe('')
    expect(scriptTags.text({ pbody: true })).toBe('<script data-vue-meta="test" src="/script.js" data-pbody="true"></script>')
  })

  test('script append body', () => {
    const tags = [{ src: '/script.js', body: true }]
    const scriptTags = generateServerInjector('script', tags)

    expect(scriptTags.text()).toBe('')
    expect(scriptTags.text({ body: true })).toBe('<script data-vue-meta="test" src="/script.js" data-body="true"></script>')
    expect(scriptTags.text({ pbody: true })).toBe('')
  })
})
