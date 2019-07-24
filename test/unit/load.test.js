import { pTick, createDOM } from '../utils'

const onLoadAttribute = {
  k: 'onload',
  v: 'this.__vm_l=1'
}

const getLoadAttribute = () => `${onLoadAttribute.k}="${onLoadAttribute.v}"`

describe('load callbacks', () => {
  let load
  beforeEach(async () => {
    jest.resetModules()
    load = await import('../../src/client/load')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('isDOMLoaded', async () => {
    jest.useRealTimers()
    const { document } = createDOM()
    await pTick()

    jest.spyOn(document, 'readyState', 'get').mockReturnValue('loading')
    expect(load.isDOMLoaded(document)).toBe(false)

    jest.spyOn(document, 'readyState', 'get').mockReturnValue('interactive')
    expect(load.isDOMLoaded(document)).toBe(true)

    jest.spyOn(document, 'readyState', 'get').mockReturnValue('complete')
    expect(load.isDOMLoaded(document)).toBe(true)
  })

  test('isDOMComplete', async () => {
    jest.useRealTimers()
    const { document } = createDOM()
    await pTick()

    jest.spyOn(document, 'readyState', 'get').mockReturnValue('loading')
    expect(load.isDOMComplete(document)).toBe(false)

    jest.spyOn(document, 'readyState', 'get').mockReturnValue('interactive')
    expect(load.isDOMComplete(document)).toBe(false)

    jest.spyOn(document, 'readyState', 'get').mockReturnValue('complete')
    expect(load.isDOMComplete(document)).toBe(true)
  })

  test('waitDOMLoaded', async () => {
    expect(load.waitDOMLoaded()).toBe(true)

    jest.spyOn(document, 'readyState', 'get').mockReturnValue('loading')
    const waitPromise = load.waitDOMLoaded()
    expect(waitPromise).toEqual(expect.any(Promise))

    const domLoaded = new Event('DOMContentLoaded')
    document.dispatchEvent(domLoaded)

    await expect(waitPromise).resolves.toEqual(expect.any(Object))
  })

  test('addCallback (no query)', () => {
    const callback = () => {}
    load.addCallback(callback)

    const matches = jest.fn(() => false)
    load.applyCallbacks({ matches })

    expect(matches).toHaveBeenCalledTimes(1)
    expect(matches).toHaveBeenCalledWith(`[${getLoadAttribute()}]`)
  })

  test('addCallback (query)', () => {
    const callback = () => {}
    load.addCallback('script', callback)

    const matches = jest.fn(() => false)
    load.applyCallbacks({ matches })

    expect(matches).toHaveBeenCalledTimes(1)
    expect(matches).toHaveBeenCalledWith(`script[${getLoadAttribute()}]`)
  })

  test('addCallbacks', () => {
    const addListeners = jest.spyOn(document, 'querySelectorAll').mockReturnValue(false)

    const config = { tagIDKeyName: 'test-id' }

    const tags = [
      { [config.tagIDKeyName]: 'test1', callback: false },
      { [config.tagIDKeyName]: false, callback: () => {} },
      { [config.tagIDKeyName]: 'test1', callback: () => {} },
      { [config.tagIDKeyName]: 'test2', callback: () => {} }
    ]

    load.addCallbacks(config, 'link', tags)

    const matches = jest.fn(() => false)
    load.applyCallbacks({ matches })

    expect(matches).toHaveBeenCalledTimes(2)
    expect(matches).toHaveBeenCalledWith(`link[data-${config.tagIDKeyName}="test1"][${getLoadAttribute()}]`)
    expect(matches).toHaveBeenCalledWith(`link[data-${config.tagIDKeyName}="test2"][${getLoadAttribute()}]`)

    expect(addListeners).not.toHaveBeenCalled()
  })

  test('addCallbacks (auto add listeners)', () => {
    const addListeners = jest.spyOn(document, 'querySelectorAll').mockReturnValue(false)

    const config = { tagIDKeyName: 'test-id', loadCallbackAttribute: 'test-load' }

    const tags = [
      { [config.tagIDKeyName]: 'test1', callback: () => {} }
    ]

    load.addCallbacks(config, 'style', tags, true)

    const matches = jest.fn(() => false)
    load.applyCallbacks({ matches })

    expect(matches).toHaveBeenCalledTimes(1)
    expect(matches).toHaveBeenCalledWith(`style[data-${config.tagIDKeyName}="test1"][${getLoadAttribute()}]`)

    expect(addListeners).toHaveBeenCalled()
  })

  test('callback trigger', () => {
    const { window, document } = createDOM()

    const callback = jest.fn()

    const el = document.createElement('script')
    el.setAttribute(onLoadAttribute.k, onLoadAttribute.v)
    document.body.appendChild(el)

    load.addCallback(callback)
    load.applyCallbacks(el)

    const loadEvent = new window.Event('load')
    el.dispatchEvent(loadEvent)

    expect(callback).toHaveBeenCalled()
  })

  test('callback trigger (loaded before adding)', () => {
    const { document } = createDOM()

    const callback = jest.fn()

    const el = document.createElement('script')
    el.setAttribute(onLoadAttribute.k, onLoadAttribute.v)
    el.__vm_l = 1
    document.body.appendChild(el)

    load.addCallback(callback)
    load.applyCallbacks(el)

    expect(callback).toHaveBeenCalled()
  })

  test('callback trigger (only once)', () => {
    const { window, document } = createDOM()

    const callback = jest.fn()

    const el = document.createElement('script')
    el.setAttribute(onLoadAttribute.k, onLoadAttribute.v)
    document.body.appendChild(el)

    el.__vm_l = 1

    load.addCallback(callback)
    load.applyCallbacks(el)

    el.__vm_cb = true

    const loadEvent = new window.Event('load')
    el.dispatchEvent(loadEvent)

    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('only one event listener added', () => {
    const { window, document } = createDOM()

    const el = document.createElement('script')
    const addEventListener = el.addEventListener.bind(el)
    const addEventListenerSpy = jest.spyOn(el, 'addEventListener').mockImplementation((...args) => {
      return addEventListener(...args)
    })
    el.setAttribute(onLoadAttribute.k, onLoadAttribute.v)
    document.body.appendChild(el)

    load.addCallback(() => {})
    load.applyCallbacks(el)

    const loadEvent1 = new window.Event('load')
    el.dispatchEvent(loadEvent1)

    expect(addEventListenerSpy).toHaveBeenCalledTimes(1)

    el.setAttribute(onLoadAttribute.k, onLoadAttribute.v)
    load.applyCallbacks(el)

    const loadEvent2 = new window.Event('load')
    el.dispatchEvent(loadEvent2)

    expect(addEventListenerSpy).toHaveBeenCalledTimes(1)
  })
})
