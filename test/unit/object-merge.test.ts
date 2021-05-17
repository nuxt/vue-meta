import { createMergedObject, MergeContext } from '../../src/object-merge'
import { createProxy } from '../../src/object-merge/proxy'

describe('simple proxy operations', () => {
  let context: MergeContext<any>

  beforeEach(() => {
    context = {
      sources: [],
      active: {},
      resolve: ([option]) => option
    }
  })

  test('proxy has same structure as target', () => {
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

  test('updating the proxy updates the active object in the context', () => {
    const target = {}

    const proxy = createProxy(context, target, {})

    proxy.str = 'test'

    expect(context.active.str).toBe('test')

    proxy.str = 'update'

    expect(context.active.str).toBe('update')

    proxy.str = undefined

    expect(context.active.str).toBeUndefined()
  })

  test('updating individual elements in an array child on the proxy is supported', () => {
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

  test('updating an object child on the proxy sets the new object value as active', () => {
    const target = {}

    const proxy = createProxy(context, target, { str2: 'test' })

    proxy.obj = { str: 'test' }

    expect(context.active.obj).toBeDefined()
    expect('str2' in context.active.obj).toBe(false)
    expect(context.active.obj).toEqual({
      str: 'test'
    })
  })

  test('removing an object child also removes it from active', () => {
    const target = {}

    const proxy = createProxy(context, target, {})

    proxy.obj = { str: 'test' }

    expect(context.active.obj).toBeDefined()

    delete proxy.obj

    expect(context.active.obj).not.toBeDefined()
  })

  test('removing a property from an object child removes it form active but keeps the object child', () => {
    const target = {}

    const proxy = createProxy(context, target, {})

    proxy.obj = { str: 'test' }

    expect(context.active.obj).toBeDefined()

    delete proxy.obj.str

    expect(context.active.obj).toEqual({})
  })
})

describe('multiple proxy operations', () => {
  test('two sources are merged into active', () => {
    const active: Record<string, any> = {}
    const { addSource } = createMergedObject<typeof active>((values, _contexts) => {
      const value = values[values.length - 1]
      return value
    }, active)

    addSource({
      str1: 'test',
      obj: {
        str1: 'test'
      }
    })

    addSource({
      str2: 'test',
      obj: {
        str2: 'test'
      }
    }, {}, true)

    expect(active.str1).not.toBeUndefined()
    expect(active.str2).not.toBeUndefined()
    expect(active.obj.str1).not.toBeUndefined()
    expect(active.obj.str2).not.toBeUndefined()
  })

  test('a source can be removed by its source reference', () => {
    const active: Record<string, any> = {}
    const { addSource, delSource } = createMergedObject<typeof active>((values, _contexts) => {
      const value = values[values.length - 1]
      return value
    }, active)

    addSource({ str: 'test1' })

    const source2 = { str: 'test2' }
    addSource(source2, {}, true)

    expect(active.str).toBe('test2')

    delSource(source2)

    expect(active.str).toBe('test1')
  })

  test('a source can be removed by its proxy', () => {
    const active: Record<string, any> = {}
    const { compute, addSource, delSource } = createMergedObject<typeof active>((values, _contexts) => {
      const value = values[values.length - 1]
      return value
    }, active)

    addSource({ str: 'test1' })

    const proxy2 = addSource({ str: 'test2' })
    compute()

    expect(active.str).toBe('test2')

    delSource(proxy2)

    expect(active.str).toBe('test1')
  })

  test('nested objects on a proxy source recompute all child properties ', () => {
    const active: Record<string, any> = {}
    const { compute, addSource, delSource } = createMergedObject<typeof active>((values, _contexts) => {
      const value = values[values.length - 1]
      return value
    }, active)

    addSource({
      obj: {
        str1: 'test1',
        str2: 'empty'
      }
    })

    const proxy2 = addSource({
      obj: {
        str1: 'test2'
      }
    })

    compute()

    expect(active.obj.str1).toBe('test2')
    expect(active.obj.str2).toBe('empty')

    proxy2.obj = {
      str1: 'test3'
    }

    expect(active.obj.str1).toBe('test3')
    expect(active.obj.str2).toBe('empty')

    delSource(proxy2)

    expect(active.obj.str1).toBe('test1')
    expect(active.obj.str2).toBe('empty')
  })
})
