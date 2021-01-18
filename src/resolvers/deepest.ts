import { ResolveContext, ResolveMethod } from '../object-merge'
import { MetaContext } from '../types'
import { resolveOption } from '.'

type MergeContextDeepest = MetaContext & {
  depth: number
}

export function setup (context: MergeContextDeepest): void {
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

export const resolve: ResolveMethod = resolveOption((acc: any, context: ResolveContext) => {
  const { depth } = (context as unknown as MergeContextDeepest)
  if (!acc || depth > acc) {
    return acc
  }
})
