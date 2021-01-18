import { ResolveContext, ResolveMethod } from '../object-merge'

export type ResolveOptionReducer = (accumulator: any, context: ResolveContext) => ResolveMethod

export const resolveOption: (predicament: ResolveOptionReducer) => ResolveMethod = predicament => (options, contexts) => {
  let resolvedIndex = -1

  contexts.reduce((acc: ResolveContext | undefined, context, index) => {
    const retval = predicament(acc, context)

    if (retval !== acc) {
      resolvedIndex = index
      return retval
    }

    return acc
  }, undefined)

  if (resolvedIndex > -1) {
    return options[resolvedIndex]
  }
}
