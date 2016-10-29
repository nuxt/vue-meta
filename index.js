(function (global) {
  'use strict'

  // initialize vue-meta
  var VueMeta = {}

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

    /**
     * Does the grunt work of exposing component meta options
     * to the server-rendered context
     * @return {Object} - all the meta info for currently matched components
     */
    Vue.prototype.$meta = function $meta () {
      return getMetaInfoDefinition(Vue, this)
    }
  }

  /**
   * Recursively traverses each component, checking for a `metaInfo`
   * option. It then merges all these options into one object, giving
   * higher priority to deeply nested components.
   * @param  {Function} Vue - the Vue constructor
   * @param  {Object} $instance - the current instance
   * @param  {Object} [metaInfo={}] - the merged options
   * @return {Object} metaInfo - the merged options
   */
  function getMetaInfoDefinition (Vue, $instance, metaInfo) {
    // set default for first run
    metaInfo = metaInfo || {}

    // if current instance has a metaInfo option, merge it in
    if ($instance.$options.metaInfo) {
      metaInfo = Vue.util.mergeOptions(metaInfo, $instance.$options.metaInfo)
    }

    // check if any children also have a metaInfo option
    // NOTE: since the order of $instance.$children cannot be gauranteed,
    //       you should be careful about non-unique meta properties in
    //       sibling components
    var len = $instance.$children.length
    if (len) {
      var i = 0
      for (; i < len; i++) {
        metaInfo = getMetaInfoDefinition(Vue, $instance.$children[i], metaInfo)
      }
    }

    return metaInfo
  }

  // automatic installation when global context
  if (typeof Vue !== 'undefined') {
    Vue.use(VueMeta)
  }

  // export VueMeta
  if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = VueMeta
  } else if (typeof define === 'function' && define.amd) {
    define(function () { return VueMeta })
  } else {
    global.VueMeta = VueMeta
  }
})(this)
