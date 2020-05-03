const {
  baseParse,
  transform,
  generate,
  processIf,
  getBaseTransformPreset,
  createObjectExpression,
  createObjectProperty
} = require('@vue/compiler-core')

const { parse } = require('@vue/compiler-dom')

function headTransform (node, context) {
  console.log('NODE', node)
  if (node.type === 1 /* NodeTypes.ELEMENT */) {
    return () => {
      if (!context.parent.codegenNode) {
        context.parent.codegenNode = createObjectExpression([])
      }

      const options = context.parent.codegenNode
      const option = createObjectProperty(
        node.tag,
        node.children.length === 1 ? node.children[0] : 'null'
      )

      // options.properties.push(option)
    }
  }
}

module.exports = function (source, map) {
  // TODO: add options
  const ast = parse(source)
  // console.log('AST', ast)

  const [nodeTransforms, directiveTransforms] = getBaseTransformPreset({
    prefixIdentifiers: true
  })

  transform(ast, {
    prefixIdentifiers: true,
    nodeTransforms: [
      ...nodeTransforms,
      headTransform
    ],
    directiveTransforms
  })

  const result = generate(ast, { mode: 'module' })

  console.log(result.code)

  this.callback(null, `
import { computed } from 'vue'

${result.code}
export default function (component) {
  const setup = component.setup

  component.setup = function (...args) {
    console.log(component)
    const __htmlMetaData = computed(() => {

    })

    return {
      ...setup.apply(this, args),
      __htmlMetaData
    }
  }

}`, map)
  /**/
}
