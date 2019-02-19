import { defaultOptions } from './'

const metaInfoData = {
  title: {
    add: {
      data: 'Hello World',
      expect: ['<title data-vue-meta="true">Hello World</title>'],
      test(side, defaultTest) {
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
      expect: ['<base data-vue-meta="true" href="href">']
    },
    change: {
      data: [{ href: 'href2' }],
      expect: ['<base data-vue-meta="true" href="href2">']
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
        '<meta data-vue-meta="true" charset="utf-8">',
        '<meta data-vue-meta="true" property="a" content="a">'
      ]
    },
    change: {
      data: [
        { charset: 'utf-16' },
        { property: 'a', content: 'b' }
      ],
      expect: [
        '<meta data-vue-meta="true" charset="utf-16">',
        '<meta data-vue-meta="true" property="a" content="b">'
      ]
    },
    // make sure elements that already exists are not unnecessarily updated
    duplicate: {
      data: [
        { charset: 'utf-16' },
        { property: 'a', content: 'c' }
      ],
      expect: [
        '<meta data-vue-meta="true" charset="utf-16">',
        '<meta data-vue-meta="true" property="a" content="c">'
      ],
      test(side, defaultTest) {
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
      expect: ['<link data-vue-meta="true" rel="stylesheet" href="href">']
    },
    change: {
      data: [{ rel: 'stylesheet', href: 'href', media: 'screen' }],
      expect: ['<link data-vue-meta="true" rel="stylesheet" href="href" media="screen">']
    },
    remove: {
      data: [],
      expect: ['']
    }
  },
  style: {
    add: {
      data: [{ type: 'text/css', cssText: '.foo { color: red; }' }],
      expect: ['<style data-vue-meta="true" type="text/css">.foo { color: red; }</style>']
    },
    change: {
      data: [{ type: 'text/css', cssText: '.foo { color: blue; }' }],
      expect: ['<style data-vue-meta="true" type="text/css">.foo { color: blue; }</style>']
    },
    remove: {
      data: [],
      expect: ['']
    }
  },
  script: {
    add: {
      data: [
        { src: 'src', async: true, defer: true, [defaultOptions.tagIDKeyName]: 'content' },
        { src: 'src', async: true, defer: true, body: true }
      ],
      expect: [
        '<script data-vue-meta="true" src="src" async defer data-vmid="content"></script>',
        '<script data-vue-meta="true" src="src" async defer data-body="true"></script>'
      ],
      test(side, defaultTest) {
        return () => {
          if (side === 'client') {
            for (const index in this.expect) {
              this.expect[index] = this.expect[index].replace(/(async|defer)/g, '$1="true"')
            }
            const tags = defaultTest()

            expect(tags.addedTags.script[0].parentNode.tagName).toBe('HEAD')
            expect(tags.addedTags.script[1].parentNode.tagName).toBe('BODY')
          } else {
            // ssr doesnt generate data-body tags
            const bodyScript = this.expect[1]
            this.expect = [this.expect[0]]

            const tags = defaultTest()

            expect(tags.text()).not.toContain(bodyScript)
          }
        }
      }
    },
    // this test only runs for client so we can directly expect wrong boolean attributes
    change: {
      data: [{ src: 'src', async: true, defer: true, [defaultOptions.tagIDKeyName]: 'content2' }],
      expect: ['<script data-vue-meta="true" src="src" async="true" defer="true" data-vmid="content2"></script>']
    },
    remove: {
      data: [],
      expect: ['']
    }
  },
  noscript: {
    add: {
      data: [{ innerHTML: '<p>noscript</p>' }],
      expect: ['<noscript data-vue-meta="true"><p>noscript</p></noscript>']
    },
    change: {
      data: [{ innerHTML: '<p>noscript, no really</p>' }],
      expect: ['<noscript data-vue-meta="true"><p>noscript, no really</p></noscript>']
    },
    remove: {
      data: [],
      expect: ['']
    }
  },
  htmlAttrs: {
    add: {
      data: { foo: 'bar' },
      expect: ['<html foo="bar" data-vue-meta="foo">']
    },
    change: {
      data: { foo: 'baz' },
      expect: ['<html foo="baz" data-vue-meta="foo">']
    },
    remove: {
      data: {},
      expect: ['<html>']
    }
  },
  headAttrs: {
    add: {
      data: { foo: 'bar' },
      expect: ['<head foo="bar" data-vue-meta="foo">']
    },
    change: {
      data: { foo: 'baz' },
      expect: ['<head foo="baz" data-vue-meta="foo">']
    },
    remove: {
      data: {},
      expect: ['<head>']
    }
  },
  bodyAttrs: {
    add: {
      data: { foo: 'bar' },
      expect: ['<body foo="bar" data-vue-meta="foo">']
    },
    change: {
      data: { foo: 'baz' },
      expect: ['<body foo="baz" data-vue-meta="foo">']
    },
    remove: {
      data: {},
      expect: ['<body>']
    }
  },
  empty: {
    add: {
      data: [{}],
      expect: [''],
      test: side => side === 'server'
    }
  }
}

export default metaInfoData
