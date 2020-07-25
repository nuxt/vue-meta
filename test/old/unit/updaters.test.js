import _updateClientMetaInfo from '../../src/client/updateClientMetaInfo'
import {
  defaultOptions,
  ssrAppId,
  ssrAttribute,
} from '../../src/shared/constants'
import metaInfoData from '../utils/meta-info-data'
import * as load from '../../src/client/load'
import { clearClientAttributeMap } from '../utils'

const updateClientMetaInfo = (type, data) =>
  _updateClientMetaInfo(ssrAppId, defaultOptions, { [type]: data })

describe('updaters', () => {
  let html

  beforeAll(() => {
    html = document.getElementsByTagName('html')[0]

    // remove default meta charset
    Array.from(html.getElementsByTagName('meta')).forEach(el =>
      el.parentNode.removeChild(el)
    )
  })

  for (const type in metaInfoData) {
    const typeTests = metaInfoData[type]

    const testCases = {
      add: tags => {
        typeTests.add.expect.forEach((expected, index) => {
          if (
            !['title', 'htmlAttrs', 'headAttrs', 'bodyAttrs'].includes(type)
          ) {
            expect(tags.tagsAdded[type][index].outerHTML).toBe(expected)
          }
          expect(html.outerHTML).toContain(expected)
        })
      },
      change: tags => {
        typeTests.add.expect.forEach((expected, index) => {
          if (!typeTests.change.expect.includes(expected)) {
            expect(html.outerHTML).not.toContain(expected)
          }
        })

        typeTests.change.expect.forEach((expected, index) => {
          if (
            !['title', 'htmlAttrs', 'headAttrs', 'bodyAttrs'].includes(type)
          ) {
            expect(tags.tagsAdded[type][index].outerHTML).toBe(expected)
          }
          expect(html.outerHTML).toContain(expected)
        })
      },
      remove: tags => {
        // TODO: i'd expect tags.removedTags to be populated
        typeTests.add.expect.forEach((expected, index) => {
          expect(html.outerHTML).not.toContain(expected)
        })

        typeTests.change.expect.forEach((expected, index) => {
          expect(html.outerHTML).not.toContain(expected)
        })

        expect(html.outerHTML).not.toContain(`<${type}`)
      },
    }

    describe(`${type} type tests`, () => {
      beforeAll(() => clearClientAttributeMap())

      Object.keys(typeTests).forEach(action => {
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
  }
})

describe('extra tests', () => {
  test('adds callback listener on hydration', () => {
    const addListeners = load.addListeners
    const addListenersSpy = jest
      .spyOn(load, 'addListeners')
      .mockImplementation(addListeners)

    const html = document.getElementsByTagName('html')[0]
    html.setAttribute(ssrAttribute, 'true')

    const data = [
      {
        src: 'src1',
        [defaultOptions.tagIDKeyName]: 'content',
        callback: () => {},
      },
    ]
    const tags = updateClientMetaInfo('script', data)

    expect(tags).toBe(false)
    expect(html.hasAttribute(ssrAttribute)).toBe(false)
    expect(addListenersSpy).toHaveBeenCalledTimes(1)
  })
})
