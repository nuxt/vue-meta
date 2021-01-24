import * as render from '../../src/render'

// Note: testing isnt rly independent as they also rely on ./src/config/tags

describe('render', () => {
  test('render key-string element (without value attribute)', () => {
    const context = {}
    const key = 'TitleTest'
    const data = 'my title'
    const config = {
      tag: 'title'
    }

    const res = render.renderMeta(context, key, data, config)
    // console.log('RES', res)

    expect(res.to).toBeUndefined()
    expect(res.vnode).toMatchObject({ __v_isVNode: true })

    expect(res.vnode.type).toEqual('title')
    expect(res.vnode.props).toEqual({})

    expect(res.vnode.children).toEqual('my title')
  })

  test('render key-string element (without name attribute)', () => {
    const context = {}
    const key = 'CharsetTest'
    const data = 'utf8'
    const config = {
      tag: 'meta',
      nameless: true,
      valueAttribute: 'charset'
    }

    const res = render.renderMeta(context, key, data, config)
    // console.log('RES', res)

    expect(res.to).toBeUndefined()
    expect(res.vnode).toMatchObject({ __v_isVNode: true })

    expect(res.vnode.type).toEqual('meta')
    expect(res.vnode.props).toMatchObject({ charset: 'utf8' })
  })

  test('render key-string element (with name attribute)', () => {
    const context = {}
    const key = 'DescriptionTest'
    const data = 'my description'
    const config = {
      tag: 'meta'
    }

    const res = render.renderMeta(context, key, data, config)
    // console.log('RES', res)

    expect(res.to).toBeUndefined()
    expect(res.vnode).toMatchObject({ __v_isVNode: true })

    expect(res.vnode.type).toEqual('meta')
    expect(res.vnode.props).toMatchObject({ name: 'DescriptionTest', content: 'my description' })
  })

  test('render key-object element', () => {
    const context = {}
    const key = 'DescriptionTest2'
    const data = { content: 'my description 2' }
    const config = {
      tag: 'meta'
    }

    const res = render.renderMeta(context, key, data, config)
    // console.log('RES', res)

    expect(res.to).toBeUndefined()
    expect(res.vnode).toMatchObject({ __v_isVNode: true })

    expect(res.vnode.type).toEqual('meta')
    expect(res.vnode.props).toMatchObject({ name: 'DescriptionTest2', content: 'my description 2' })
  })

  test('render key-object element with json', () => {
    const context = {}
    const key = 'JsonTest'
    const data = { json: ['content'] }
    const config = {
      tag: 'script'
    }

    const res = render.renderMeta(context, key, data, config)
    // console.log('RES', res)

    expect(res.to).toBeUndefined()
    expect(res.vnode).toMatchObject({ __v_isVNode: true })

    expect(res.vnode.type).toEqual('script')
    expect(res.vnode.props).toMatchObject({})
    expect(res.vnode.children).toEqual('["content"]')
  })

  test('render key-object element with raw content', () => {
    const context = {}
    const key = 'RawTest'
    const data = { rawContent: '<p>One JS please!</p>' }
    const config = {
      tag: 'noscript'
    }

    const res = render.renderMeta(context, key, data, config)
    // console.log('RES', res)

    expect(res.to).toBeUndefined()
    expect(res.vnode).toMatchObject({ __v_isVNode: true })

    expect(res.vnode.type).toEqual('noscript')
    expect(res.vnode.props).toMatchObject({ innerHTML: '<p>One JS please!</p>' })
  })

  test('render array<key-string> elements', () => {
    const context = {}
    const key = 'kal-el'
    const data = [
      'man',
      'woman'
    ]
    const config = {
      tag: 'meta',
      valueAttribute: 'super'
    }

    const res = render.renderMeta(context, key, data, config)
    // console.log('RES', res)

    expect(res).toBeInstanceOf(Array)
    expect(res.length).toBe(2)

    expect(res[0].to).toBeUndefined()
    expect(res[0].vnode).toMatchObject({ __v_isVNode: true })
    expect(res[0].vnode.type).toEqual('meta')
    expect(res[0].vnode.props).toMatchObject({ super: 'man' })

    expect(res[1].to).toBeUndefined()
    expect(res[1].vnode).toMatchObject({ __v_isVNode: true })
    expect(res[1].vnode.type).toEqual('meta')
    expect(res[1].vnode.props).toMatchObject({ super: 'woman' })
  })

  test('render array<key-object> elements', () => {
    const context = {}
    const key = 'kal-el'
    const data = [
      { super: 'man' },
      { clark: 'kent' }
    ]

    const config = {}

    const res = render.renderMeta(context, key, data, config)
    // console.log(res)

    expect(res).toBeInstanceOf(Array)
    expect(res.length).toBe(2)

    expect(res[0].to).toBeUndefined()
    expect(res[0].vnode).toMatchObject({ __v_isVNode: true })
    expect(res[0].vnode.type).toEqual('kal-el')
    expect(res[0].vnode.props).toMatchObject({ super: 'man' })

    expect(res[1].to).toBeUndefined()
    expect(res[1].vnode).toMatchObject({ __v_isVNode: true })
    expect(res[1].vnode.type).toEqual('kal-el')
    expect(res[1].vnode.props).toMatchObject({ clark: 'kent' })
  })

  test('render custom group', () => {
    const context = {}
    const key = 'customGroup'
    const data = {
      title: 'my custom title',
      description: 'my custom description'
    }

    const config = {
      group: true,
      tag: 'meta'
    }

    const res = render.renderMeta(context, key, data, config)
    // console.log('RES', res, res[0])

    expect(res).toBeInstanceOf(Array)
    expect(res.length).toBe(2)

    expect(res[0].to).toBeUndefined()
    expect(res[0].vnode).toMatchObject({ __v_isVNode: true })
    expect(res[0].vnode.type).toEqual('meta')
    expect(res[0].vnode.props).toMatchObject({ content: 'my custom title' })

    expect(res[1].to).toBeUndefined()
    expect(res[1].vnode).toMatchObject({ __v_isVNode: true })
    expect(res[1].vnode.type).toEqual('meta')
    expect(res[1].vnode.props).toMatchObject({ content: 'my custom description' })
  })

  test('render custom group (namespaced tag)', () => {
    const context = {}
    const key = 'og'
    const data = {
      title: 'my og title',
      description: 'my og description',
      image: [
        'img1',
        'img2'
      ]
    }

    const config = {
      group: true,
      keyAttribute: 'property',
      namespacedAttribute: true,
      tag: 'meta'
    }

    const res = render.renderMeta(context, key, data, config)
    // console.log('RES', res, res[0])

    expect(res).toBeInstanceOf(Array)
    expect(res.length).toBe(4)

    expect(res[0].to).toBeUndefined()
    expect(res[0].vnode).toMatchObject({ __v_isVNode: true })
    expect(res[0].vnode.type).toEqual('meta')
    expect(res[0].vnode.props).toMatchObject({ property: 'og:title', content: 'my og title' })

    expect(res[1].to).toBeUndefined()
    expect(res[1].vnode).toMatchObject({ __v_isVNode: true })
    expect(res[1].vnode.type).toEqual('meta')
    expect(res[1].vnode.props).toMatchObject({ property: 'og:description', content: 'my og description' })

    expect(res[2].to).toBeUndefined()
    expect(res[2].vnode).toMatchObject({ __v_isVNode: true })
    expect(res[2].vnode.type).toEqual('meta')
    expect(res[2].vnode.props).toMatchObject({ property: 'og:image', content: 'img1' })

    expect(res[3].to).toBeUndefined()
    expect(res[3].vnode).toMatchObject({ __v_isVNode: true })
    expect(res[3].vnode.type).toEqual('meta')
    expect(res[3].vnode.props).toMatchObject({ property: 'og:image', content: 'img2' })
  })

  test('render custom group (namespaced attribute and name attribute)', () => {
    const context = {}
    const key = 'og'
    const data = {
      title: 'my og title',
      description: 'my og description',
      image: [
        'img1',
        'img2'
      ]
    }

    const config = {
      group: true,
      keyAttribute: 'property',
      namespacedAttribute: true,
      tag: 'meta'
    }

    const res = render.renderMeta(context, key, data, config)
    // console.log('RES', res, res[0])

    expect(res).toBeInstanceOf(Array)
    expect(res.length).toBe(4)

    expect(res[0].to).toBeUndefined()
    expect(res[0].vnode).toMatchObject({ __v_isVNode: true })
    expect(res[0].vnode.type).toEqual('meta')
    expect(res[0].vnode.props).toMatchObject({ property: 'og:title', content: 'my og title' })

    expect(res[1].to).toBeUndefined()
    expect(res[1].vnode).toMatchObject({ __v_isVNode: true })
    expect(res[1].vnode.type).toEqual('meta')
    expect(res[1].vnode.props).toMatchObject({ property: 'og:description', content: 'my og description' })

    expect(res[2].to).toBeUndefined()
    expect(res[2].vnode).toMatchObject({ __v_isVNode: true })
    expect(res[2].vnode.type).toEqual('meta')
    expect(res[2].vnode.props).toMatchObject({ property: 'og:image', content: 'img1' })

    expect(res[3].to).toBeUndefined()
    expect(res[3].vnode).toMatchObject({ __v_isVNode: true })
    expect(res[3].vnode.type).toEqual('meta')
    expect(res[3].vnode.props).toMatchObject({ property: 'og:image', content: 'img2' })
  })

  test('render custom group (array)', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(_ => _)
    const context = {}
    const key = 'og'
    const data = ['data']

    const config = {
      group: true,
      keyAttribute: 'property',
      namespacedAttribute: true,
      tag: 'meta'
    }

    const res = render.renderMeta(context, key, data, config)
    // console.log('RES', res, res[0])

    expect(res).toBeInstanceOf(Array)
    expect(res.length).toBe(0)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Specifying an array for group properties isnt supported'))
    spy.mockRestore()
  })

  test('render custom group (tag namespaced)', () => {
    const context = {}
    const key = 'esi'
    const data = {
      children: [{
        tag: 'choose',
        children: [{
          tag: 'when',
          test: '$(HTTP_COOKIE{group})=="Advanced"',
          children: [{
            tag: 'include',
            src: 'http://www.example.com/advanced.html'
          }]
        }]
      }]
    }

    const config = {
      group: true,
      namespaced: true,
      attributes: ['src', 'test', 'text']
    }

    const res = render.renderMeta(context, key, data, config)
    // console.log('RES', res)

    expect(res).toBeInstanceOf(Array)
    expect(res.length).toBe(1)

    expect(res[0].to).toBeUndefined()
    expect(res[0].vnode).toMatchObject({ __v_isVNode: true })
    expect(res[0].vnode.type).toEqual('esi:choose')
    expect(res[0].vnode.props).toEqual({})

    expect(res[0].vnode.children).toBeInstanceOf(Array)
    expect(res[0].vnode.children.length).toBe(1)

    expect(res[0].vnode.children[0]).toMatchObject({ __v_isVNode: true })
    expect(res[0].vnode.children[0].type).toEqual('esi:when')
    expect(res[0].vnode.children[0].props).toEqual({ test: '$(HTTP_COOKIE{group})=="Advanced"' })

    expect(res[0].vnode.children[0].children).toBeInstanceOf(Array)
    expect(res[0].vnode.children[0].children.length).toBe(1)

    expect(res[0].vnode.children[0].children[0]).toMatchObject({ __v_isVNode: true })
    expect(res[0].vnode.children[0].children[0].type).toEqual('esi:include')
    expect(res[0].vnode.children[0].children[0].props).toEqual({ src: 'http://www.example.com/advanced.html' })
  })

  test('customized render with slot', () => {
    const key = 'title'
    const data = 'my title'
    const config = {
      tag: 'title'
    }

    const slot = jest.fn().mockReturnValue([{ children: 'slot title' }])
    const context = {
      metainfo: { [key]: data },
      slots: { title: slot }
    }

    const res = render.renderMeta(context, key, data, config)
    // console.log('RES', res)

    expect(res.to).toBeUndefined()
    expect(res.vnode).toMatchObject({ __v_isVNode: true })

    expect(res.vnode.type).toEqual('title')
    expect(res.vnode.props).toEqual({})

    expect(res.vnode.children).toEqual('slot title')

    expect(slot).toHaveBeenCalledTimes(1)
    expect(slot).toHaveBeenCalledWith({
      content: data,
      metainfo: context.metainfo
    })
  })

  test('customized render with slot (group)', () => {
    const key = 'og'
    const data = {
      title: 'my og title'
    }

    const slot = jest.fn().mockReturnValue([{ children: 'og slot title' }])
    const context = {
      metainfo: { [key]: data },
      slots: { 'og(title)': slot }
    }

    const config = {
      group: true,
      keyAttribute: 'property',
      namespacedAttribute: true,
      tag: 'meta'
    }

    const res = render.renderMeta(context, key, data, config)
    // console.log('RES', res, res[0])

    expect(res).toBeInstanceOf(Array)
    expect(res.length).toBe(1)

    expect(res[0].to).toBeUndefined()
    expect(res[0].vnode).toMatchObject({ __v_isVNode: true })
    expect(res[0].vnode.type).toEqual('meta')
    expect(res[0].vnode.props).toMatchObject({ property: 'og:title', content: 'og slot title' })

    expect(slot).toHaveBeenCalledTimes(1)
    expect(slot).toHaveBeenCalledWith({
      content: data.title,
      [key]: data,
      metainfo: context.metainfo
    })
  })

  test('customized render with slot (fallsback to original content)', () => {
    const key = 'title'
    const data = 'my title'
    const config = {
      tag: 'title'
    }

    const slot = jest.fn().mockReturnValue(undefined) // slot returns nothing
    const context = {
      metainfo: { [key]: data },
      slots: { title: slot }
    }

    const res = render.renderMeta(context, key, data, config)
    // console.log('RES', res)

    expect(res.to).toBeUndefined()
    expect(res.vnode).toMatchObject({ __v_isVNode: true })

    expect(res.vnode.type).toEqual('title')
    expect(res.vnode.props).toEqual({})

    expect(res.vnode.children).toEqual('my title')

    expect(slot).toHaveBeenCalledTimes(1)
    expect(slot).toHaveBeenCalledWith({
      content: data,
      metainfo: context.metainfo
    })
  })

  test('render attributes (add + remove)', () => {
    const key = 'bodyAttrs'
    const data = { class: 'theme-dark' }

    const config = {
      attributesFor: 'body'
    }

    const setAttribute = jest.fn()
    const removeAttribute = jest.fn()

    const doc = jest.spyOn(document, 'querySelectorAll').mockReturnValue([{
      setAttribute,
      removeAttribute
    }])

    const context = {}

    const res = render.renderMeta(context, key, data, config)
    // console.log('RES', res)

    expect(res).toBeUndefined()

    expect(doc).toHaveBeenCalledTimes(1)
    expect(doc).toHaveBeenCalledWith('body')

    expect(setAttribute).toHaveBeenCalledTimes(1)
    expect(setAttribute).toHaveBeenCalledWith('class', 'theme-dark')

    const dataUpdate = { 'data-content': ['a', 'b'] }
    render.renderMeta(context, key, dataUpdate, config)

    expect(doc).toHaveBeenCalledTimes(1)
    expect(doc).toHaveBeenCalledWith('body')

    expect(setAttribute).toHaveBeenCalledTimes(2)
    expect(setAttribute).toHaveBeenCalledWith('data-content', 'a,b')

    expect(removeAttribute).toHaveBeenCalledTimes(1)
    expect(removeAttribute).toHaveBeenCalledWith('class')

    doc.mockRestore()
  })
})
