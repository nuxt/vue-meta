import { resolveOption } from './index'
import type { MetaResolveContext, MetaResolveSetup } from '../types'

type MergeResolveContextDeepest = MetaResolveContext & {
  depth: number
}

export const setup: MetaResolveSetup = (context) => {
  let depth: number = 0

  if (context.vm) {
    let { vm } = context

    do {
      if (vm.parent) {
        depth++

        vm = vm.parent
      }
    } while (vm && vm.parent && vm !== vm.root)
  }

  (context as MergeResolveContextDeepest).depth = depth
}

export const resolve = resolveOption<number>((currentValue, context) => {
  const { depth } = context as MergeResolveContextDeepest

  if (!currentValue || depth > currentValue) {
    return depth
  }

  return currentValue
})
