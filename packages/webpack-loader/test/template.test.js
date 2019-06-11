const path = require('path')

const {
  mockRender,
  mockBundleAndRun
} = require('./utils')

test('static metadata', (done) => {
  mockBundleAndRun({
    entry: 'static.vue'
  }, ({ window, module }) => {
    expect(module.data.metaInfo).toBeDefined()

    const vnode = mockRender(module)

    expect(vnode.metaInfo.title).toBeDefined()
    expect(vnode.metaInfo.title[0].innerHTML).toBe('Static Title')
    expect(vnode.metaInfo.meta).toBeDefined()
    expect(vnode.metaInfo.meta[0].name).toBe('description')
    expect(vnode.metaInfo.meta[0].content).toBe('static description')
    done()
  })
})

test('metadata with bindings', (done) => {
  mockBundleAndRun({
    entry: 'with-bindings.vue'
  }, ({ window, module }) => {
    expect(module.computed.metaInfo).not.toBeUndefined()

    const vnode = mockRender(module, {
      title: 'Test Title',
      description: 'Test Description'
    })

    expect(vnode.metaInfo.title).toBeDefined()
    expect(vnode.metaInfo.title[0].innerHTML).toBe('Test Title')
    expect(vnode.metaInfo.meta).toBeDefined()
    expect(vnode.metaInfo.meta[0].name).toBe('description')
    expect(vnode.metaInfo.meta[0].content).toBe('Test Description')
    done()
  })
})
