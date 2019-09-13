import { defaultOptions } from '../../src/shared/constants'
import { attributeMap } from '../../src/client/updaters/attribute'

const metaInfoData = {
  title: {
    add: {
      data: 'Hello World',
      expect: ['<title>Hello World</title>'],
      test (side, defaultTest) {
        if (side === 'client') {
          // client side vue-meta uses document.title and doesnt change the html
          return () => {
            this.expect[0] = '<title>Hello World</title>'
            const spy = jest.spyOn(document, 'title', 'set')

            defaultTest()

            expect(spy).toHaveBeenCalledTimes(1)
            expect(spy).toHaveBeenCalledWith('Hello World')
          }
        } else {
          return defaultTest
        }
      }
    }
  },
  base: {
    add: {
      data: [{ href: 'href' }],
      expect: ['<base data-vue-meta="ssr" href="href">']
    },
    change: {
      data: [{ href: 'href2' }],
      expect: ['<base data-vue-meta="ssr" href="href2">']
    },
    remove: {
      data: [],
      expect: ['']
    }
  },
  meta: {
    add: {
      data: [{ charset: 'utf-8' }, { property: 'a', content: 'a' }],
      expect: [
        '<meta data-vue-meta="ssr" charset="utf-8">',
        '<meta data-vue-meta="ssr" property="a" content="a">'
      ]
    },
    change: {
      data: [
        { charset: 'utf-16' },
        { property: 'a', content: 'b' }
      ],
      expect: [
        '<meta data-vue-meta="ssr" charset="utf-16">',
        '<meta data-vue-meta="ssr" property="a" content="b">'
      ]
    },
    // make sure elements that already exists are not unnecessarily updated
    duplicate: {
      data: [
        { charset: 'utf-16' },
        { property: 'a', content: 'c' }
      ],
      expect: [
        '<meta data-vue-meta="ssr" charset="utf-16">',
        '<meta data-vue-meta="ssr" property="a" content="c">'
      ],
      test (side, defaultTest) {
        if (side === 'client') {
          return () => {
            const tags = defaultTest()

            expect(tags.addedTags.meta.length).toBe(1)
            // TODO: not sure if we really expect this
            expect(tags.removedTags.meta.length).toBe(1)
          }
        }
      }
    },
    remove: {
      data: [],
      expect: ['']
    }
  },
  link: {
    add: {
      data: [{ rel: 'stylesheet', href: 'href' }],
      expect: ['<link data-vue-meta="ssr" rel="stylesheet" href="href">']
    },
    change: {
      data: [{ rel: 'stylesheet', href: 'href', media: 'screen' }],
      expect: ['<link data-vue-meta="ssr" rel="stylesheet" href="href" media="screen">']
    },
    remove: {
      data: [],
      expect: ['']
    }
  },
  style: {
    add: {
      data: [{ type: 'text/css', cssText: '.foo { color: red; }' }],
      expect: ['<style data-vue-meta="ssr" type="text/css">.foo { color: red; }</style>']
    },
    change: {
      data: [{ type: 'text/css', cssText: '.foo { color: blue; }' }],
      expect: ['<style data-vue-meta="ssr" type="text/css">.foo { color: blue; }</style>']
    },
    remove: {
      data: [],
      expect: ['']
    }
  },
  script: {
    add: {
      data: [
        { src: 'src1', async: false, defer: true, [defaultOptions.tagIDKeyName]: 'content', callback: () => {} },
        { src: 'src-prepend', async: true, defer: false, pbody: true },
        { src: 'src2', async: false, defer: true, body: true },
        { src: 'src3', async: false, skip: true },
        { type: 'application/ld+json',
          json: {
            '@context': 'http://schema.org',
            '@type': 'Organization',
            'name': 'MyApp',
            'url': 'https://www.myurl.com',
            'logo': 'https://www.myurl.com/images/logo.png'
          }
        }
      ],
      expect: [
        '<script data-vue-meta="ssr" src="src1" defer data-vmid="content" onload="this.__vm_l=1"></script>',
        '<script data-vue-meta="ssr" src="src-prepend" async data-pbody="true"></script>',
        '<script data-vue-meta="ssr" src="src2" defer data-body="true"></script>',
        '<script data-vue-meta="ssr" type="application/ld+json">{"@context":"http://schema.org","@type":"Organization","name":"MyApp","url":"https://www.myurl.com","logo":"https://www.myurl.com/images/logo.png"}</script>'
      ],
      test (side, defaultTest) {
        return () => {
          if (side === 'client') {
            for (const index in this.expect) {
              this.expect[index] = this.expect[index].replace(/(async|defer)/g, '$1=""')
              this.expect[index] = this.expect[index].replace(/ onload="this.__vm_l=1"/, '')
            }
            const tags = defaultTest()

            expect(tags.addedTags.script[0].parentNode.tagName).toBe('HEAD')
            expect(tags.addedTags.script[1].parentNode.tagName).toBe('BODY')
            expect(tags.addedTags.script[2].parentNode.tagName).toBe('BODY')
          } else {
            // ssr doesnt generate data-body tags
            const bodyPrepended = this.expect[1]
            const bodyAppended = this.expect[2]
            this.expect = [this.expect.shift(), this.expect.pop()]

            const tags = defaultTest()
            const html = tags.text()

            expect(html).not.toContain(bodyPrepended)
            expect(html).not.toContain(bodyAppended)
          }
        }
      }
    },
    // this test only runs for client so we can directly expect wrong boolean attributes
    change: {
      data: [{ src: 'src', async: true, defer: true, [defaultOptions.tagIDKeyName]: 'content2' }],
      expect: ['<script data-vue-meta="ssr" src="src" async="" defer="" data-vmid="content2"></script>']
    },
    remove: {
      data: [],
      expect: ['']
    }
  },
  noscript: {
    add: {
      data: [{ innerHTML: '<p>noscript</p>' }],
      expect: ['<noscript data-vue-meta="ssr"><p>noscript</p></noscript>']
    },
    change: {
      data: [{ innerHTML: '<p>noscript, no really</p>' }],
      expect: ['<noscript data-vue-meta="ssr"><p>noscript, no really</p></noscript>']
    },
    remove: {
      data: [],
      expect: ['']
    }
  },
  htmlAttrs: {
    add: {
      data: { foo: 'bar' },
      expect: ['<html foo="bar" data-vue-meta="%7B%22foo%22:%7B%22ssr%22:%22bar%22%7D%7D">'],
      test (side, defaultTest) {
        return () => {
          if (side === 'client') {
            this.expect[0] = this.expect[0].replace(/ data-vue-meta="[^"]+"/, '')
          }

          defaultTest()

          if (side === 'client') {
            expect(attributeMap).toEqual({ htmlAttrs: { foo: { ssr: 'bar' } } })
          }
        }
      }
    },
    change: {
      data: { foo: 'baz' },
      expect: ['<html foo="baz">'],
      test (side, defaultTest) {
        return () => {
          defaultTest()

          expect(attributeMap).toEqual({ htmlAttrs: { foo: { ssr: 'baz' } } })
        }
      }
    },
    remove: {
      data: {},
      expect: ['<html>'],
      test (side, defaultTest) {
        return () => {
          defaultTest()

          expect(attributeMap).toEqual({ htmlAttrs: { foo: {} } })
        }
      }
    }
  },
  headAttrs: {
    add: {
      data: { foo: 'bar' },
      expect: ['<head foo="bar" data-vue-meta="%7B%22foo%22:%7B%22ssr%22:%22bar%22%7D%7D">'],
      test (side, defaultTest) {
        return () => {
          if (side === 'client') {
            this.expect[0] = this.expect[0].replace(/ data-vue-meta="[^"]+"/, '')
          }

          defaultTest()

          if (side === 'client') {
            expect(attributeMap).toEqual({ headAttrs: { foo: { ssr: 'bar' } } })
          }
        }
      }
    },
    change: {
      data: { foo: 'baz' },
      expect: ['<head foo="baz">'],
      test (side, defaultTest) {
        return () => {
          defaultTest()

          expect(attributeMap).toEqual({ headAttrs: { foo: { ssr: 'baz' } } })
        }
      }
    },
    remove: {
      data: {},
      expect: ['<head>'],
      test (side, defaultTest) {
        return () => {
          defaultTest()

          expect(attributeMap).toEqual({ headAttrs: { foo: {} } })
        }
      }
    }
  },
  bodyAttrs: {
    add: {
      data: { foo: 'bar', fizz: ['fuzz', 'fozz'] },
      expect: ['<body foo="bar" fizz="fuzz fozz" data-vue-meta="%7B%22foo%22:%7B%22ssr%22:%22bar%22%7D,%22fizz%22:%7B%22ssr%22:%5B%22fuzz%22,%22fozz%22%5D%7D%7D">'],
      test (side, defaultTest) {
        return () => {
          if (side === 'client') {
            this.expect[0] = this.expect[0].replace(/ data-vue-meta="[^"]+"/, '')
          }

          defaultTest()

          if (side === 'client') {
            expect(attributeMap).toEqual({ bodyAttrs: {
              foo: { ssr: 'bar' },
              fizz: { ssr: ['fuzz', 'fozz'] }
            } })
          }
        }
      }
    },
    change: {
      data: { foo: 'baz' },
      expect: ['<body foo="baz">'],
      test (side, defaultTest) {
        return () => {
          defaultTest()

          expect(attributeMap).toEqual({ bodyAttrs: { foo: { ssr: 'baz' }, fizz: {} } })
        }
      }
    },
    remove: {
      data: {},
      expect: ['<body>'],
      test (side, defaultTest) {
        return () => {
          defaultTest()

          expect(attributeMap).toEqual({ bodyAttrs: { foo: {}, fizz: {} } })
        }
      }
    }
  }
}

export default metaInfoData
