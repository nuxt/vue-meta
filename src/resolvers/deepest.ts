import {
  // ActiveNode,
  /* ActiveResolverSetup, ActiveResolverMethod, */ MetaContext,
  PathSegments,
  ShadowNode,
  GetActiveNode,
  GetShadowNodes
} from '../types'

interface DeepestResolverMetaContext extends MetaContext {
  depth?: number
}

export function setup (context: DeepestResolverMetaContext): void {
  let depth: number = 0

  if (context.vm) {
    let { vm } = context

    do {
      depth++
      vm = vm.parent
    } while (vm && vm !== vm.root)
  }

  context.depth = depth
}

export function resolve (
  key: string,
  _pathSegments: PathSegments,
  getOptions: GetShadowNodes,
  getCurrentValue: GetActiveNode
): any {
  let resolvedOption: ShadowNode | void

  const options = getOptions()

  for (const option of options) {
    if (!resolvedOption || resolvedOption.context.depth < option.context.depth) {
      resolvedOption = option
    }
  }

  console.log(
    'DEEPEST.RESOLVE',
    key,
    getCurrentValue(),
    options.map(({ value }) => value)
  )

  if (resolvedOption) {
    console.log(resolvedOption.value)
    return resolvedOption.value
  }
}
