import type { MetaResolveContext } from '../types'
import { resolveOption } from './index'

type MergeResolveContextDeepest = MetaResolveContext & {
  depth: number
}

export function setup (context: MergeResolveContextDeepest): void {
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

  context.depth = depth
}

export const resolve = resolveOption<number, MergeResolveContextDeepest>((currentValue, context) => {
  const { depth } = context

  if (!currentValue || depth > currentValue) {
    return depth
  }

  return currentValue
})
