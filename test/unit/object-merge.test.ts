import { MergeContext } from 'src/object-merge'
import { createProxy } from '../../src/object-merge/proxy'

describe('proxy', () => {
  let context: MergeContext<any>

  beforeEach(() => {
    context = {
      sources: [],
      active: {},
      resolve: ([option]) => option
    }
  })

  test('proxy (get)', () => {
    const target = {
      str: 'test',
      obj: {
        str: 'test'
      }
    }

    const proxy = createProxy(context, target, {})

    expect(proxy.str).toBe('test')
    expect(proxy.obj.str).toBe('test')
  })

  test('string (set, update, delete)', () => {
    const target = {}

    const proxy = createProxy(context, target, {})

    proxy.str = 'test'

    expect(context.active.str).toBe('test')

    proxy.str = 'update'

    expect(context.active.str).toBe('update')

    proxy.str = undefined

    expect(context.active.str).toBeUndefined()
  })

  test('array (set, update, delete)', () => {
    const target = {}

    const proxy = createProxy(context, target, {})

    proxy.arr = [0, 1]

    expect(context.active.arr).toEqual([0, 1])

    proxy.arr[1] = 2

    expect(context.active.arr).toEqual(expect.arrayContaining([0, 2]))
    expect(context.active.arr).toEqual(expect.not.arrayContaining([1]))

    delete proxy.arr[1]

    expect(context.active.arr).toEqual(expect.not.arrayContaining([2]))

    delete proxy.arr

    expect(context.active.arr).toBeUndefined()
  })

  test('proxy (set object)', () => {
    const target = {}

    const proxy = createProxy(context, target, {})

    proxy.obj = { str: 'test' }

    expect(context.active.obj).toBeDefined()
    expect(context.active.obj.str).toBe('test')
  })

  test('proxy (remove)', () => {
    const target = {}

    const proxy = createProxy(context, target, {})

    proxy.obj = { str: 'test' }

    expect(context.active.obj).toBeDefined()

    delete proxy.obj

    expect(context.active.obj).not.toBeDefined()
  })

  test('proxy (remove child)', () => {
    const target = {}

    const proxy = createProxy(context, target, {})

    proxy.obj = { str: 'test' }

    expect(context.active.obj).toBeDefined()

    delete proxy.obj.str

    expect(context.active.obj).toEqual({})
  })
})
