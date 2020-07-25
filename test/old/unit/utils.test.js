/**
 * @jest-environment node
 */
import { find, findIndex, includes, toArray } from '../../src/utils/array'
import { ensureIsArray } from '../../src/utils/ensure'
import { hasGlobalWindowFn } from '../../src/utils/window'

describe('shared', () => {
  afterEach(() => jest.restoreAllMocks())

  test('ensureIsArray ensures var is array', () => {
    let a = { p: 1 }
    expect(ensureIsArray(a)).toEqual([])

    a = 1
    expect(ensureIsArray(a)).toEqual([])

    a = [1]
    expect(ensureIsArray(a)).toBe(a)
  })

  test('ensureIsArray ensures obj prop is array', () => {
    const a = { p: 1 }
    expect(ensureIsArray(a, 'p')).toEqual({ p: [] })
  })

  test('no error when window is not defined', () => {
    expect(hasGlobalWindowFn()).toBe(false)
  })

  /* eslint-disable no-extend-native */
  test('find polyfill', () => {
    const _find = Array.prototype.find
    Array.prototype.find = false

    const arr = [1, 2, 3]
    expect(find(arr, (v, i) => i === 0)).toBe(1)
    expect(find(arr, (v, i) => i === 3)).toBe(undefined)

    Array.prototype.find = _find
  })

  test('findIndex polyfill', () => {
    const _findIndex = Array.prototype.findIndex
    Array.prototype.findIndex = false

    const arr = [1, 2, 3]
    expect(findIndex(arr, v => v === 2)).toBe(1)
    expect(findIndex(arr, v => v === 4)).toBe(-1)

    Array.prototype.findIndex = _findIndex
  })

  test('includes polyfill', () => {
    const _includes = Array.prototype.includes
    Array.prototype.includes = false

    const arr = [1, 2, 3]
    expect(includes(arr, 2)).toBe(true)
    expect(includes(arr, 4)).toBe(false)

    Array.prototype.includes = _includes
  })

  test('from/toArray polyfill', () => {
    const _from = Array.from
    Array.from = false

    expect(toArray('foo')).toEqual(['f', 'o', 'o'])

    Array.from = _from
  })
  /* eslint-enable no-extend-native */
})
