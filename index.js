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

    // TODO: implement plugin
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
