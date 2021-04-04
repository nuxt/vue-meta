import type { ResolveContext, ResolveMethod } from '../object-merge'

export interface ResolveOptionPredicament<T, U> {
  (currentValue: T | undefined, context: U): T
}

export const resolveOption = <T, U = ResolveContext>(predicament: ResolveOptionPredicament<T, U>, initialValue?: T): ResolveMethod<any, U> => (options, contexts) => {
  let resolvedIndex = -1

  contexts.reduce((acc, context, index) => {
    const retval = predicament(acc, context)

    if (retval !== acc) {
      resolvedIndex = index
      return retval
    }

    return acc
  }, initialValue)

  if (resolvedIndex > -1) {
    return options[resolvedIndex]
  }
}
