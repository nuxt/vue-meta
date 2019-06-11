const qs = require('querystring')
const { compile } = require('vue-template-compiler')

function vnodesToMetaData(vnodes, metaInfo = {}) {
  let hasBindings = false
  for (const vnode of vnodes) {
    if (vnode.type !== 1) {
      continue
    }

    if (!metaInfo[vnode.tag]) {
      metaInfo[vnode.tag] = []
    }

    const metaData = {}
    if (vnode.attrsList.length) {
      vnode.attrs.forEach(attr => (metaData[attr.name] = `${attr.dynamic === undefined ? '' : 'this.'}${attr.value}`))
    }

    if (vnode.children.length) {
      metaData.innerHTML = vnode.children.reduce((acc, child) => {
        if (child.static) {
          return `"${child.text}"`
        }

        return acc + child.tokens.reduce((bcc, token) => {
          if (typeof token === 'object' && token['@binding']) {
            hasBindings = true
            return `${bcc}${bcc ? ' + ' : ''}this.${token['@binding']}`
          }

          return `${bcc}${bcc ? ' + ' : ''}"${token}"`
        }, '')
      }, '')
    }

    metaInfo[vnode.tag].push(metaData)
  }

  return [
    metaInfo,
    hasBindings
  ]
}

function templify(value) {
  if (Array.isArray(value)) {
    const arrStr = value.map(templify).join(',')
    return `[${arrStr}]`
  }

  if (typeof value === 'object') {
    const objStr = Object.keys(value).map(key => `"${key}": ${templify(value[key])}`).join(',')
    return `{${objStr}}`
  }

  return value
}

module.exports = function (source, map) {
  const rawQuery = this.resourceQuery.slice(1)
  const inheritQuery = `&${rawQuery}`
  const incomingQuery = qs.parse(rawQuery)

  if (incomingQuery.type !== 'custom' || incomingQuery.blockType !== 'head') {
    this.callback(null, source, map)
  }

  const vnodes = compile(`<head>${source}</head>`)

  const [ metaInfo, hasBindings ] = vnodesToMetaData(vnodes.ast.children)

  let content
  if (hasBindings) {
    content = `
      Component.options.computed = {
        ...Component.options.computed,
        metaInfo() {
          return ${templify(metaInfo)}
        }
      }`
  } else {
    content = `
      Component.options.data = {
        ...Component.options.data,
        metaInfo: ${templify(metaInfo)}
      }`
  }

  this.callback(null, `export default function (Component) { ${content} }`, map)
}
