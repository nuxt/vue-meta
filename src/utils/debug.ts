
interface DebugInterface {
  (...args: any[]): void
  warn: Function
  error: Function
}

export const debugFn = (logFn: Function, setChildFns: boolean = false) => {
  const fn = (...args: any[]) => {
    try {
      throw new Error('DEBUG')
    } catch (err) {
      logFn(...args, '\n', err)
    }
  }

  if (setChildFns) {
    fn.warn = debugFn(console.warn) // eslint-disable-line no-console
    fn.error = debugFn(console.error) // eslint-disable-line no-console
  }

  return fn
}

export const debug: DebugInterface = debugFn(console.log, true) // eslint-disable-line no-console
