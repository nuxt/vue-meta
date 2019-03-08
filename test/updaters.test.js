import _updateClientMetaInfo from '../src/client/updateClientMetaInfo'
import { defaultOptions } from './utils/constants'
import metaInfoData from './utils/meta-info-data'

const updateClientMetaInfo = (type, data) => _updateClientMetaInfo(defaultOptions, { [type]: data })

describe('updaters', () => {
  let html

  beforeAll(() => {
    html = document.getElementsByTagName('html')[0]

    // remove default meta charset
    Array.from(html.getElementsByTagName('meta')).forEach(el => el.parentNode.removeChild(el))
  })

  Object.keys(metaInfoData).forEach((type) => {
    const typeTests = metaInfoData[type]

    const testCases = {
      add: (tags) => {
        typeTests.add.expect.forEach((expected, index) => {
          if (!['title', 'htmlAttrs', 'headAttrs', 'bodyAttrs'].includes(type)) {
            expect(tags.addedTags[type][index].outerHTML).toBe(expected)
          }
          expect(html.outerHTML).toContain(expected)
        })
      },
      change: (tags) => {
        typeTests.add.expect.forEach((expected, index) => {
          if (!typeTests.change.expect.includes(expected)) {
            expect(html.outerHTML).not.toContain(expected)
          }
        })

        typeTests.change.expect.forEach((expected, index) => {
          if (!['title', 'htmlAttrs', 'headAttrs', 'bodyAttrs'].includes(type)) {
            expect(tags.addedTags[type][index].outerHTML).toBe(expected)
          }
          expect(html.outerHTML).toContain(expected)
        })
      },
      remove: (tags) => {
        // TODO: i'd expect tags.removedTags to be populated

        typeTests.add.expect.forEach((expected, index) => {
          expect(html.outerHTML).not.toContain(expected)
        })

        typeTests.change.expect.forEach((expected, index) => {
          expect(html.outerHTML).not.toContain(expected)
        })

        expect(html.outerHTML).not.toContain(`<${type}`)
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
          const tags = updateClientMetaInfo(type, testInfo.data)

          if (testCases[action]) {
            testCases[action](tags)
          }

          return tags
        }

        let testFn
        if (testInfo.test) {
          testFn = testInfo.test('client', defaultTestFn)

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
