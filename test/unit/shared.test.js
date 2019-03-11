import { setOptions } from '../../src/shared/options'
import { defaultOptions } from '../../src/shared/constants'

describe('shared', () => {
  test('can use setOptions', () => {
    const keyName = 'MY KEY'
    let options = { keyName }
    options = setOptions(options)

    expect(options.keyName).toBe(keyName)
    expect(options.contentKeyName).toBeDefined()
    expect(options.contentKeyName).toBe(defaultOptions.contentKeyName)
  })
})
