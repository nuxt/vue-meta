import { createProxy, createHandler, setByObject, remove } from '../../src/continuous-object-merge'

describe('resolve', () => {
  let active, shadow
  let context1, context2

  beforeEach(() => {
    active = {}
    shadow = {}

    const resolve = (key, pathSegments, getOptions, getCurrentValue) => {
      const options = getOptions()
      console.log('RESOLVE', options)
      return options[options.length - 1].value
    }

    context1 = { active, shadow, resolve }
    context2 = { active, shadow, resolve }
  })

  test('resolve (string)', () => {
    const target1 = {
      str: 'string value 1'
    }

    const target2 = {
      str: 'string value 2'
    }

    // Set initial value
    setByObject(context1, target1)

    // Init proxy
    const handler1 = createHandler(context1)
    const proxy1 = createProxy(target1, handler1)

    setByObject(context2, target2)
    const handler2 = createHandler(context2)
    const proxy2 = createProxy(target2, handler2)

    expect(active.str).toBe('string value 2')

    proxy2.str = 'test'

    expect(active.str).toBe('test')

    remove(context2)

    expect(active.str).toBe('string value 1')

    remove(context1)

    expect(active.str).toBeUndefined()
    expect(shadow.str.length).toBe(0)
  })

  test('resolve (object)', () => {
    const target1 = {
      obj: {
        key: 'object value 1'
      }
    }

    const target2 = {
      obj: {
        key: 'object value 2'
      }
    }

    // Set initial value
    setByObject(context1, target1)

    // Init proxy
    const handler1 = createHandler(context1)
    const proxy1 = createProxy(target1, handler1)

    setByObject(context2, target2)
    const handler2 = createHandler(context2)
    const proxy2 = createProxy(target2, handler2)

    expect(active.obj.key).toBe('object value 2')

    proxy2.obj.key = 'test'

    expect(active.obj.key).toBe('test')

    proxy2.obj = { key: 'test again' }

    expect(active.obj.key).toBe('test again')
    expect(shadow.obj.key.length).toBe(2)

    remove(context2)

    expect(active.obj.key).toBe('object value 1')

    remove(context1)

    // TODO: should we clean up the obj ref too?
    expect(active.obj).toEqual({})

    expect(active.obj.key).toBeUndefined()
    expect(shadow.obj.key.length).toBe(0)
  })

  test.skip('resolve (array)', () => {
    const target1 = {
      arr: [
        'array value 1'
      ]
    }

    const target2 = {
      arr: [
        'array value 2'
      ]
    }

    // TODO: test this, is specifying a resolver enough or do we need to add an array-merge option

    // Set initial value
    setByObject(context1, target1)

    // Init proxy
    const handler1 = createHandler(context1)
    const proxy1 = createProxy(target1, handler1)

    setByObject(context2, target2)
    const handler2 = createHandler(context2)
    const proxy2 = createProxy(target2, handler2)

    expect(active.arr).toBe('object value 2')

    proxy2.obj.key = 'test'

    expect(active.obj.key).toBe('test')

    proxy2.obj = { key: 'test again' }

    expect(active.obj.key).toBe('test again')
    expect(shadow.obj.key.length).toBe(2)

    remove(context2)

    expect(active.obj.key).toBe('object value 1')

    remove(context1)

    // TODO: should we clean up the obj ref too?
    expect(active.obj).toEqual({})

    expect(active.obj.key).toBeUndefined()
    expect(shadow.obj.key.length).toBe(0)
  })

  test.skip('resolve (collection)', () => {
    const target1 = {
      arr: [
        { key: 'collection value 1' }
      ]
    }

    const target2 = {
      arr: [
        { key: 'collection value 2' }
      ]
    }

    // Set initial value
    setByObject(context1, target1)

    // Init proxy
    const handler1 = createHandler(context1)
    const proxy1 = createProxy(target1, handler1)

    setByObject(context2, target2)
    const handler2 = createHandler(context2)
    const proxy2 = createProxy(target2, handler2)

    expect(active.str).toBe('string value 2')

    proxy2.str = 'test'

    expect(active.str).toBe('test')

    expect(shadow.str).toBeInstanceOf(Array)
    expect(shadow.str.length).toBe(2)

    remove(context2)

    expect(active.str).toBe('string value 1')

    remove(context1)

    expect(active.str).toBeUndefined()
    expect(shadow.str.length).toBe(0)
  })
})
