import { isArray, isPlainObject } from '@vue/shared'
import { createProxy, createHandler, setByObject, remove } from '../../src/continuous-object-merge'

describe('resolve', () => {
  let active, shadow
  let context1, context2

  beforeEach(() => {
    active = {}
    shadow = {}

    const resolve = (_key, _pathSegments, getOptions, _getCurrentValue) => {
      const options = getOptions()
      console.log('RESOLVE', options)

      const hasArrayOption = options.some(option => isArray(option.value))
      if (hasArrayOption) {
        const groupedOptions = {}
        for (const option of options) {
          console.log('OPTION', option)
          if (!isArray(option.value)) {
            continue
          }

          for (const value of option.value) {
            if (isPlainObject(value) && 'vmid' in value) {
              groupedOptions[value.vmid] = value
            }
          }
        }
        console.log(groupedOptions)
        const values = []
        for (const option of options) {
          if (!isArray(option.value)) {
            continue
          }

          for (const value of option.value) {
            if (!isPlainObject(value) || !('vmid' in value)) {
              values.push(value)
            } else if (groupedOptions[value.vmid]) {
              values.push(groupedOptions[value.vmid])
              delete groupedOptions[value.vmid]
            }
          }
        }
        console.log('VALUES', values)
        return values
      }

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
    /* const proxy1 = */ createProxy(target1, handler1)

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
    /* const proxy1 = */ createProxy(target1, handler1)

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

  test('resolve (array)', () => {
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

    // Set initial value & init proxy
    setByObject(context1, target1)
    const handler1 = createHandler(context1)
    const proxy1 = createProxy(target1, handler1)

    setByObject(context2, target2)
    const handler2 = createHandler(context2)
    const proxy2 = createProxy(target2, handler2)

    expect(active.arr).toEqual(['array value 1', 'array value 2'])

    proxy2.arr[0] = 'test 2'

    expect(active.arr).toEqual(['array value 1', 'test 2'])

    proxy1.arr = ['test 1']

    expect(active.arr).toEqual(['test 1', 'test 2'])
    expect(shadow.arr.length).toBe(2)

    remove(context1)

    expect(active.arr).toEqual(['test 2'])

    delete proxy2.arr

    // TODO: should we clean up the obj ref too?
    expect(active.arr).toBeUndefined()
    expect(shadow.arr.length).toBe(0)

    proxy1.arr = ['test again 1']
    expect(active.arr).toEqual(['test again 1'])

    proxy2.arr = []
    proxy2.arr[0] = 'test again 2'
    expect(active.arr).toEqual(['test again 1', 'test again 2'])
  })

  test('resolve (collection)', () => {
    const target1 = {
      arr: [
        { key: 'collection value 1.1' },
        { vmid: 'a', key: 'collection value 1.2' }
      ]
    }

    const target2 = {
      arr: [
        { vmid: 'a', key: 'collection value 2.1' },
        { vmid: 'b', key: 'collection value 2.2' }
      ]
    }

    // Set initial value & init proxy
    setByObject(context1, target1)
    const handler1 = createHandler(context1)
    const proxy1 = createProxy(target1, handler1)

    setByObject(context2, target2)
    const handler2 = createHandler(context2)
    const proxy2 = createProxy(target2, handler2)

    expect(active.arr).toEqual([
      { key: 'collection value 1.1' },
      { vmid: 'a', key: 'collection value 2.1' },
      { vmid: 'b', key: 'collection value 2.2' }
    ])

    proxy1.arr[0].key = 'test 1.1'
    proxy1.arr[1].key = 'test 1.2'

    expect(active.arr).toEqual([
      { key: 'test 1.1' },
      { vmid: 'a', key: 'test 1.2' }, // TODO: this is WRONG, should be collection value 2.1 => setting a prop in a collection needs to trigger the resolveActive for the parent array
      { vmid: 'b', key: 'collection value 2.2' }
    ])

    proxy2.arr = [
      { vmid: 'b', key: 'collection value 2.1' },
      { vmid: 'c', key: 'collection value 2.2' }
    ]

    expect(active.arr).toEqual([
      { key: 'test 1.1' },
      { vmid: 'a', key: 'test 1.2' },
      { vmid: 'b', key: 'collection value 2.1' },
      { vmid: 'c', key: 'collection value 2.2' }
    ])

    expect(shadow.arr.length).toBe(2)

    remove(context1)

    expect(active.arr).toEqual([
      { vmid: 'b', key: 'collection value 2.1' },
      { vmid: 'c', key: 'collection value 2.2' }
    ])

    delete proxy2.arr

    // TODO: should we clean up the obj ref too?
    expect(active.arr).toBeUndefined()
    expect(shadow.arr.length).toBe(0)

    proxy1.arr = [{ vmid: 'a', key: 'test again 1' }]
    expect(active.arr).toEqual([{ vmid: 'a', key: 'test again 1' }])

    // TODO: fix
    proxy2.arr = []
    proxy2.arr[0] = { vmid: 'a', value: 'test again 2' }
    expect(active.arr).toEqual([
      { vmid: 'a', key: 'test again 2' }
    ])
  })
})
