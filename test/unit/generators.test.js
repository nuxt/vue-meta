import _generateServerInjector from '../../src/server/generateServerInjector'
import { defaultOptions } from '../../src/shared/constants'
import metaInfoData from '../utils/meta-info-data'
import { titleGenerator } from '../../src/server/generators'

const generateServerInjector = metaInfo =>
  _generateServerInjector(defaultOptions, metaInfo).injectors

describe('generators', () => {
  for (const type in metaInfoData) {
    const typeTests = metaInfoData[type]

    const testCases = {
      add: tags => {
        let html = tags.text()

        // ssr only returns the attributes, convert to full tag
        if (['htmlAttrs', 'headAttrs', 'bodyAttrs'].includes(type)) {
          html = `<${type.substr(0, 4)} ${html}>`
        }

        typeTests.add.expect.forEach(expected => {
          expect(html).toContain(expected)
        })
      },
    }

    describe(`${type} type tests`, () => {
      Object.keys(typeTests).forEach(action => {
        const testInfo = typeTests[action]

        // return when no test case available
        if (!testCases[action]) {
          return
        }

        const defaultTestFn = () => {
          const newInfo = generateServerInjector({ [type]: testInfo.data })
          testCases[action](newInfo[type])
          return newInfo[type]
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
  test('empty config doesnt generate a tag', () => {
    const { meta } = generateServerInjector({ meta: [] })

    expect(meta.text()).toEqual('')
  })

  test('config with empty object doesnt generate a tag', () => {
    const { meta } = generateServerInjector({ meta: [{}] })

    expect(meta.text()).toEqual('')
  })

  test('title generator should return an empty string when title is null', () => {
    const title = null
    const generatedTitle = titleGenerator({}, 'title', title)

    expect(generatedTitle).toEqual('')
  })

  test('auto add ssrAttribute', () => {
    const { htmlAttrs } = generateServerInjector({ htmlAttrs: {} })
    expect(htmlAttrs.text(true)).toBe('data-vue-meta-server-rendered')

    const { headAttrs } = generateServerInjector({ headAttrs: {} })
    expect(headAttrs.text(true)).toBe('')

    const { bodyAttrs } = generateServerInjector({ bodyAttrs: {} })
    expect(bodyAttrs.text(true)).toBe('')
  })

  test('script prepend body', () => {
    const tags = [{ src: '/script.js', pbody: true }]
    const { script: scriptTags } = generateServerInjector({ script: tags })

    expect(scriptTags.text()).toBe('')
    expect(scriptTags.text({ body: true })).toBe('')
    expect(scriptTags.text({ pbody: true })).toBe(
      '<script data-vue-meta="ssr" src="/script.js" data-pbody="true"></script>'
    )
  })

  test('script append body', () => {
    const tags = [{ src: '/script.js', body: true }]
    const { script: scriptTags } = generateServerInjector({ script: tags })

    expect(scriptTags.text()).toBe('')
    expect(scriptTags.text({ body: true })).toBe(
      '<script data-vue-meta="ssr" src="/script.js" data-body="true"></script>'
    )
    expect(scriptTags.text({ pbody: true })).toBe('')
  })

  test('add additional app and test head/body injector helpers', () => {
    const baseInfo = {
      title: 'hello',
      htmlAttrs: { lang: 'en' },
      bodyAttrs: { class: 'base-class' },
      script: [{ src: '/script.js', body: true }],
    }
    const extraInfo = {
      bodyAttrs: { class: 'extra-class' },
      script: [{ src: '/script.js', pbody: true }],
    }

    const serverInjector = _generateServerInjector(defaultOptions, baseInfo)
    serverInjector.addInfo('test-app', extraInfo)

    const meta = serverInjector.injectors

    expect(meta.script.text()).toBe('')
    expect(meta.script.text({ body: true })).toBe(
      '<script data-vue-meta="ssr" src="/script.js" data-body="true"></script>'
    )
    expect(meta.script.text({ pbody: true })).toBe(
      '<script data-vue-meta="test-app" src="/script.js" data-pbody="true"></script>'
    )

    expect(meta.head(true)).toBe('<title>hello</title>\n')
    expect(meta.bodyPrepend(true)).toBe(
      '<script data-vue-meta="test-app" src="/script.js" data-pbody="true"></script>\n'
    )
    expect(meta.bodyAppend()).toBe(
      '<script data-vue-meta="ssr" src="/script.js" data-body="true"></script>'
    )

    expect(meta.htmlAttrs.text()).toBe(
      'lang="en" data-vue-meta="%7B%22lang%22:%7B%22ssr%22:%22en%22%7D%7D"'
    )
    expect(meta.bodyAttrs.text()).toBe(
      'class="base-class extra-class" data-vue-meta="%7B%22class%22:%7B%22ssr%22:%22base-class%22,%22test-app%22:%22extra-class%22%7D%7D"'
    )
  })
})
