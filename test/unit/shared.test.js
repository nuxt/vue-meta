import { setOptions } from '../../src/shared/options'
import { defaultOptions } from '../../src/shared/constants'
import { triggerUpdate } from '../../src/client/update'

describe('shared', () => {
  test('can use setOptions', () => {
    const keyName = 'MY KEY'
    let options = { keyName }
    options = setOptions(options)

    expect(options.keyName).toBe(keyName)
    expect(options.contentKeyName).toBeDefined()
    expect(options.contentKeyName).toBe(defaultOptions.contentKeyName)
  })

  test('options.debounceWait is used', () => {
    jest.useFakeTimers()

    const refresh = jest.fn()
    const componentMock = {
      _vueMeta: {
        initialized: true,
        pausing: false
      },
      $meta: () => ({ refresh })
    }

    triggerUpdate({ debounceWait: 0 }, componentMock, 'test')

    expect(refresh).toHaveBeenCalledTimes(1)

    triggerUpdate({}, componentMock, 'test')
    expect(refresh).toHaveBeenCalledTimes(1)
    jest.advanceTimersByTime(11)
    expect(refresh).toHaveBeenCalledTimes(2)

    triggerUpdate({ debounceWait: 69420 }, componentMock, 'test')
    expect(refresh).toHaveBeenCalledTimes(2)
    jest.advanceTimersByTime(11)
    expect(refresh).toHaveBeenCalledTimes(2)
    jest.advanceTimersByTime(69500)
    expect(refresh).toHaveBeenCalledTimes(3)
  })
})
