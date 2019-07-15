import _generateServerInjector from '../../src/server/generateServerInjector'
import { defaultOptions } from '../../src/shared/constants'
import metaInfoData from '../utils/meta-info-data'
import { titleGenerator } from '../../src/server/generators'

const generateServerInjector = (type, data) => _generateServerInjector('test', defaultOptions, type, data)

describe('generators', () => {
  Object.keys(metaInfoData).forEach((type) => {
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
  })
})

describe('title generator should return an empty string when title is null', () => {
  const title = null
  const generatedTitle = titleGenerator(0, {}, 'title', title)

  expect(generatedTitle.text()).toEqual('')
})
