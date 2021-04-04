import * as utils from '../../src/utils'

describe('utils.clone', () => {
  test('string', () => {
    const str = 'test'
    expect(utils.clone(str)).toBe(str)
  })

  test('array', () => {
    const arr = ['test']
    const crr = utils.clone(arr)

    expect(crr).not.toBe(arr)
    expect(crr[0]).toBe(arr[0])
  })

  test('object', () => {
    const obj = { context: {}, child: {}, a: 1 }
    const cbj = utils.clone(obj)

    expect(cbj).not.toBe(obj)
    expect(cbj.context).toBe(obj.context)
    expect(cbj.child).not.toBe(obj.child)
    expect(cbj.a).toBe(obj.a)
  })
})
