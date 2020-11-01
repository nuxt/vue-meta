import { createProxy, createHandler } from '../../src/continuous-object-merge'

describe('proxy', () => {
  let context
  beforeEach(() => {
    context = {
      active: {},
      shadow: {}
    }
  })

  test('proxy (get)', () => {
    const target = {
      str: 'test',
      obj: {
        str: 'test'
      }
    }

    const handler = createHandler(context)
    const proxy = createProxy(target, handler)

    expect(proxy.str).toBe('test')
    expect(proxy.obj.str).toBe('test')
  })

  test('string (set, update, delete)', () => {
    const target = {}

    const handler = createHandler(context)
    const proxy = createProxy(target, handler)

    proxy.str = 'test'

    expect(context.active.str).toBe('test')

    expect(context.shadow.str).toBeInstanceOf(Array)
    expect(context.shadow.str.length).toBe(1)
    expect(context.shadow.str[0]).toMatchObject({
      context,
      value: 'test'
    })

    proxy.str = 'update'

    expect(context.active.str).toBe('update')
    expect(context.shadow.str.length).toBe(1)
    expect(context.shadow.str[0]).toMatchObject({
      context,
      value: 'update'
    })

    proxy.str = undefined

    expect(context.active.str).toBeUndefined()
    expect(context.shadow.str.length).toBe(0)
  })

  test('array (set, update, delete)', () => {
    const target = {}

    const handler = createHandler(context)
    const proxy = createProxy(target, handler)

    proxy.arr = [0, 1]

    expect(context.active.arr).toEqual([0, 1])

    expect(context.shadow.arr).toBeInstanceOf(Array)
    expect(context.shadow.arr.length).toBe(1)
    expect(context.shadow.arr[0]).toMatchObject({
      context,
      value: [0, 1]
    })

    proxy.arr[1] = 2

    expect(context.active.arr).toEqual(expect.arrayContaining([0, 2]))
    expect(context.active.arr).toEqual(expect.not.arrayContaining([1]))
    expect(context.shadow.arr.length).toBe(1)
    expect(context.shadow.arr[0]).toMatchObject({
      context,
      value: expect.arrayContaining([0, 2])
    })

    delete proxy.arr[1]

    expect(context.active.arr).toEqual(expect.not.arrayContaining([2]))
    expect(context.shadow.arr[0]).toMatchObject({
      context,
      value: expect.not.arrayContaining([2])
    })

    delete proxy.arr

    expect(context.active.arr).toBeUndefined()
    expect(context.shadow.arr).toEqual([])
  })

  test('proxy (set object)', () => {
    const target = {}

    const handler = createHandler(context)
    const proxy = createProxy(target, handler)

    proxy.obj = { str: 'test' }

    expect(context.active.obj).toBeDefined()
    expect(context.active.obj.str).toBe('test')

    expect(context.shadow.obj).toBeDefined()
    expect(context.shadow.obj.str).toMatchObject([{
      context: expect.any(Object),
      value: 'test'
    }])
  })

  test('proxy (remove)', () => {
    const target = {}

    const handler = createHandler(context)
    const proxy = createProxy(target, handler)

    proxy.obj = { str: 'test' }

    expect(context.active.obj).toBeDefined()

    delete proxy.obj

    expect(context.active.obj).not.toBeDefined()
    expect(context.shadow.obj).not.toBeDefined()
  })

  test('proxy (remove child)', () => {
    const target = {}

    const handler = createHandler(context)
    const proxy = createProxy(target, handler)

    proxy.obj = { str: 'test' }

    expect(context.active.obj).toBeDefined()

    delete proxy.obj.str

    expect(context.active.obj).toEqual({})
    expect(context.shadow.obj).toEqual({ str: [] })
  })
})
