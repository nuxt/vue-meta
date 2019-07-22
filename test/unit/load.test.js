import path from 'path'
import { JSDOM, VirtualConsole } from 'jsdom'

const pTick = () => new Promise(resolve => process.nextTick(resolve))

function createDOM(html = '<!DOCTYPE html>', options = {}) {
  const dom = new JSDOM(html, options)

  return {
    dom,
    window: dom.window,
    document: dom.window.document
  }
}

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

    jest.spyOn(document, 'readyState', 'get').mockReturnValue('loading')
    expect(load.isDOMLoaded()).toBe(true)

    await pTick()

    jest.spyOn(document, 'readyState', 'get').mockReturnValue('interactive')
    expect(load.isDOMLoaded()).toBe(true)

    jest.spyOn(document, 'readyState', 'get').mockReturnValue('complete')
    expect(load.isDOMLoaded()).toBe(true)
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

    const loadAttr = 'test-load'
    const matches = jest.fn(() => false)
    load.applyCallbacks(loadAttr, { matches })

    expect(matches).toHaveBeenCalledTimes(1)
    expect(matches).toHaveBeenCalledWith(`[data-${loadAttr}]`)
  })

  test('addCallback (query)', () => {
    const callback = () => {}
    load.addCallback('script', callback)

    const loadAttr = 'test-load'
    const matches = jest.fn(() => false)
    load.applyCallbacks(loadAttr, { matches })

    expect(matches).toHaveBeenCalledTimes(1)
    expect(matches).toHaveBeenCalledWith(`script[data-${loadAttr}]`)
  })

  test('addCallbacks', () => {
    const addListeners = jest.spyOn(document, 'querySelectorAll').mockReturnValue(false)

    const config = { tagIDKeyName: 'test-id', loadCallbackAttribute: 'test-load' }

    const tags = [
      { [config.tagIDKeyName]: 'test1', callback: false },
      { [config.tagIDKeyName]: false, callback: () => {} },
      { [config.tagIDKeyName]: 'test1', callback: () => {} },
      { [config.tagIDKeyName]: 'test2', callback: () => {} }
    ]

    load.addCallbacks(config, 'link', tags)

    const matches = jest.fn(() => false)
    load.applyCallbacks(config.loadCallbackAttribute, { matches })

    expect(matches).toHaveBeenCalledTimes(2)
    expect(matches).toHaveBeenCalledWith(`link[data-${config.tagIDKeyName}="test1"][data-${config.loadCallbackAttribute}]`)
    expect(matches).toHaveBeenCalledWith(`link[data-${config.tagIDKeyName}="test2"][data-${config.loadCallbackAttribute}]`)

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
    load.applyCallbacks(config.loadCallbackAttribute, { matches })

    expect(matches).toHaveBeenCalledTimes(1)
    expect(matches).toHaveBeenCalledWith(`style[data-${config.tagIDKeyName}="test1"][data-${config.loadCallbackAttribute}]`)

    expect(addListeners).toHaveBeenCalled()
  })

  test('callback trigger', async () => {
    const { window, document } = createDOM()

    const callback = jest.fn()
    const loadAttr = 'load'

    const el = document.createElement('script')
    el.src = '../utils/placeholder.js'
    el.dataset[loadAttr] = true
    document.body.appendChild(el)

    load.addCallback(callback)
    load.applyCallbacks(loadAttr, el)

    const loadEvent = new window.Event('load')
    el.dispatchEvent(loadEvent)

    expect(callback).toHaveBeenCalled()
  })
})

