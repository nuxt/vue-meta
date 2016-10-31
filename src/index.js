import { VUE_META_ATTRIBUTE } from './constants'

// initialize vue-meta
const VueMeta = {}

// initialize manager
const _manager = {}

/**
 * Registers the plugin with Vue.js
 * Pass it like so: Vue.use(VueMeta)
 * @param {Function} Vue - the Vue constructor
 */
VueMeta.install = function install (Vue) {
  // if we've already installed, don't do anything
  if (VueMeta.install.installed) return

  // set installation inspection flag
  VueMeta.install.installed = true

  // listen for when components mount - when they do,
  // update the meta info & the DOM
  Vue.mixin({
    mounted () {
      this.$root.$meta().updateMetaInfo()
    }
  })

  /**
   * returns a cached manager API for use on the server
   * @return {Object} - manager (The programmatic API for this module)
   */
  Vue.prototype.$meta = function $meta () {
    _manager.getMetaInfo = _manager.getMetaInfo || Vue.util.bind(getMetaInfo, this)
    _manager.updateMetaInfo = _manager.updateMetaInfo || updateMetaInfo
    _manager.inject = _manager.inject || inject
    return _manager
  }

  /**
   * Converts the state of the meta info object such that each item
   * can be compiled to a tag string on the server
   * @return {Object} - server meta info with `toString` methods
   */
  function inject () {
    const info = this.getMetaInfo()
    const serverMetaInfo = {}
    for (let key in info) {
      if (info.hasOwnProperty(key)) {
        serverMetaInfo[key] = generateServerInjector(key, info[key])
      }
    }
    return serverMetaInfo
  }

  /**
   * Converts a meta info property to one that can be stringified on the server
   * @param  {String} type - the type of data to convert
   * @param  {(String|Object|Array<Object>)} data - the data value
   * @return {Object} - the new injector
   */
  function generateServerInjector (type, data) {
    switch (type) {
      case 'title':
        return {
          toString: () => `<${type} ${VUE_META_ATTRIBUTE}="true">${data}</${type}>`
        }
      case 'htmlAttrs': {
        return {
          toString () {
            let attributeStr = ''
            for (let attr in data) {
              if (data.hasOwnProperty(attr)) {
                attributeStr += `${typeof data[attr] !== 'undefined' ? `${attr}="${data[attr]}"` : attr} `
              }
            }
            return attributeStr.trim()
          }
        }
      }
    }
  }

  /**
   * Updates meta info and renders it to the DOM
   */
  function updateMetaInfo () {
    const newMeta = this.getMetaInfo()
    if (newMeta.title) {
      updateTitle(newMeta.title)
    }
    if (newMeta.htmlAttrs) {
      updateHtmlAttrs(newMeta.htmlAttrs)
    }
  }

  /**
   * Fetches corresponding meta info for the current component state
   * @return {Object} - all the meta info for currently matched components
   */
  function getMetaInfo () {
    const info = getMetaInfoDefinition(Vue, this)
    if (info.titleTemplate) {
      info.title = info.titleTemplate.replace('%s', info.title)
    }
    return info
  }
}

/**
 * Recursively traverses each component, checking for a `metaInfo`
 * option. It then merges all these options into one object, giving
 * higher priority to deeply nested components.
 *
 * NOTE: This function uses Vue.prototype.$children, the results of which
 *       are not gauranted to be in order. For this reason, try to avoid
 *       using the same `metaInfo` property in sibling components.
 *
 * @param  {Function} Vue - the Vue constructor
 * @param  {Object} $instance - the current instance
 * @param  {Object} [metaInfo={}] - the merged options
 * @return {Object} metaInfo - the merged options
 */
function getMetaInfoDefinition (Vue, $instance, metaInfo = {
  title: '',
  htmlAttrs: {}
}) {
  // if current instance has a metaInfo option...
  if ($instance.$options.metaInfo) {
    const componentMetaInfo = $instance.$options.metaInfo

    // ...convert all function type keys to raw data
    // (this allows meta info to be inferred from props & data)...
    for (let key in componentMetaInfo) {
      if (componentMetaInfo.hasOwnProperty(key)) {
        var val = componentMetaInfo[key]
        if (typeof val === 'function') {
          componentMetaInfo[key] = val.call($instance)
        }
      }
    }

    // ...then merge the data into metaInfo
    metaInfo = Vue.util.mergeOptions(metaInfo, componentMetaInfo)
  }

  // check if any children also have a metaInfo option, if so, merge
  // them into existing data
  const len = $instance.$children.length
  if (len) {
    var i = 0
    for (; i < len; i++) {
      metaInfo = getMetaInfoDefinition(Vue, $instance.$children[i], metaInfo)
    }
  }

  // meta info is ready for consumption
  return metaInfo
}

/**
 * updates the document title
 * @param  {String} title - the new title of the document
 */
function updateTitle (title) {
  document.title = title || document.title
}

/**
 * updates the document's html tag attributes
 * @param  {Object} attrs - the new document html attributes
 */
function updateHtmlAttrs (attrs) {
  const tag = document.getElementsByTagName('html')[0]
  const vueMetaAttrString = tag.getAttribute(VUE_META_ATTRIBUTE)
  const vueMetaAttrs = vueMetaAttrString ? vueMetaAttrString.split(',') : []
  const toRemove = [].concat(vueMetaAttrs)
  for (let attr in attrs) {
    if (attrs.hasOwnProperty(attr)) {
      const val = attrs[attr] || ''
      tag.setAttribute(attr, val)
      if (vueMetaAttrs.indexOf(attr) === -1) {
        vueMetaAttrs.push(attr)
      }
      const saveIndex = toRemove.indexOf(attr)
      if (saveIndex !== -1) {
        toRemove.splice(saveIndex, 1)
      }
    }
  }
  let i = toRemove.length - 1
  for (; i >= 0; i--) {
    tag.removeAttribute(toRemove[i])
  }
  if (vueMetaAttrs.length === toRemove.length) {
    tag.removeAttribute(VUE_META_ATTRIBUTE)
  } else {
    tag.setAttribute(VUE_META_ATTRIBUTE, vueMetaAttrs.join(','))
  }
}

// automatic installation when global context
if (typeof Vue !== 'undefined') {
  Vue.use(VueMeta)
}

export default VueMeta
