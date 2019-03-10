/**
 * @jest-environment node
 */
import { ensureIsArray } from '../../src/shared/ensure'
import setOptions from '../../src/shared/options'
import { hasGlobalWindowFn } from '../../src/shared/window'
import { defaultOptions } from '../../src/shared/constants'

describe('shared', () => {
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

  test('can use setOptions', () => {
    const keyName = 'MY KEY'
    let options = { keyName }
    options = setOptions(options)

    expect(options.keyName).toBe(keyName)
    expect(options.contentKeyName).toBeDefined()
    expect(options.contentKeyName).toBe(defaultOptions.contentKeyName)
  })
})
