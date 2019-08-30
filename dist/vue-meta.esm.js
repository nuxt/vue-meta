/**
 * vue-meta v2.2.2
 * (c) 2019
 * - Declan de Wet
 * - Sébastien Chopin (@Atinux)
  * - All the amazing contributors
 * @license MIT
 */

import deepmerge from 'deepmerge';

var version = "2.2.2";

// store an id to keep track of DOM updates
var batchId = null;
function triggerUpdate(vm, hookName) {
  // if an update was triggered during initialization or when an update was triggered by the
  // metaInfo watcher, set initialized to null
  // then we keep falsy value but know we need to run a triggerUpdate after initialization
  if (!vm.$root._vueMeta.initialized && (vm.$root._vueMeta.initializing || hookName === 'watcher')) {
    vm.$root._vueMeta.initialized = null;
  }

  if (vm.$root._vueMeta.initialized && !vm.$root._vueMeta.paused) {
    // batch potential DOM updates to prevent extraneous re-rendering
    batchUpdate(function () {
      return vm.$meta().refresh();
    });
  }
}
/**
 * Performs a batched update.
 *
 * @param  {(null|Number)} id - the ID of this update
 * @param  {Function} callback - the update to perform
 * @return {Number} id - a new ID
 */

function batchUpdate(callback) {
  var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
  clearTimeout(batchId);
  batchId = setTimeout(function () {
    callback();
  }, timeout);
  return batchId;
}

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

/**
 * checks if passed argument is an array
 * @param  {any}  arg - the object to check
 * @return {Boolean} - true if `arg` is an array
 */
function isArray(arg) {
  return Array.isArray(arg);
}
function isUndefined(arg) {
  return typeof arg === 'undefined';
}
function isObject(arg) {
  return _typeof(arg) === 'object';
}
function isPureObject(arg) {
  return _typeof(arg) === 'object' && arg !== null;
}
function isFunction(arg) {
  return typeof arg === 'function';
}
function isString(arg) {
  return typeof arg === 'string';
}

function ensureIsArray(arg, key) {
  if (!key || !isObject(arg)) {
    return isArray(arg) ? arg : [];
  }

  if (!isArray(arg[key])) {
    arg[key] = [];
  }

  return arg;
}
function ensuredPush(object, key, el) {
  ensureIsArray(object, key);
  object[key].push(el);
}

function hasMetaInfo() {
  var vm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this;
  return vm && (vm._vueMeta === true || isObject(vm._vueMeta));
} // a component is in a metaInfo branch when itself has meta info or one of its (grand-)children has

function inMetaInfoBranch() {
  var vm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this;
  return vm && !isUndefined(vm._vueMeta);
}

function addNavGuards(vm) {
  // return when nav guards already added or no router exists
  if (vm.$root._vueMeta.navGuards || !vm.$root.$router) {
    /* istanbul ignore next */
    return;
  }

  vm.$root._vueMeta.navGuards = true;
  var $router = vm.$root.$router;
  var $meta = vm.$root.$meta();
  $router.beforeEach(function (to, from, next) {
    $meta.pause();
    next();
  });
  $router.afterEach(function () {
    var _$meta$resume = $meta.resume(),
        metaInfo = _$meta$resume.metaInfo;

    if (metaInfo && metaInfo.afterNavigation && isFunction(metaInfo.afterNavigation)) {
      metaInfo.afterNavigation(metaInfo);
    }
  });
}

function hasGlobalWindowFn() {
  try {
    return !isUndefined(window);
  } catch (e) {
    return false;
  }
}
var hasGlobalWindow = hasGlobalWindowFn();

var _global = hasGlobalWindow ? window : global;

var console = _global.console || {};
function warn(str) {
  /* istanbul ignore next */
  if (!console || !console.warn) {
    return;
  }

  console.warn(str);
}

var appId = 1;
function createMixin(Vue, options) {
  // for which Vue lifecycle hooks should the metaInfo be refreshed
  var updateOnLifecycleHook = ['activated', 'deactivated', 'beforeMount']; // watch for client side component updates

  return {
    beforeCreate: function beforeCreate() {
      var _this = this;

      Object.defineProperty(this, '_hasMetaInfo', {
        configurable: true,
        get: function get() {
          // Show deprecation warning once when devtools enabled
          if (Vue.config.devtools && !this.$root._vueMeta.hasMetaInfoDeprecationWarningShown) {
            warn('VueMeta DeprecationWarning: _hasMetaInfo has been deprecated and will be removed in a future version. Please use hasMetaInfo(vm) instead');
            this.$root._vueMeta.hasMetaInfoDeprecationWarningShown = true;
          }

          return hasMetaInfo(this);
        }
      }); // Add a marker to know if it uses metaInfo
      // _vnode is used to know that it's attached to a real component
      // useful if we use some mixin to add some meta tags (like nuxt-i18n)

      if (isUndefined(this.$options[options.keyName]) || this.$options[options.keyName] === null) {
        return;
      }

      if (!this.$root._vueMeta) {
        this.$root._vueMeta = {
          appId: appId
        };
        appId++;
      } // to speed up updates we keep track of branches which have a component with vue-meta info defined
      // if _vueMeta = true it has info, if _vueMeta = false a child has info


      if (!this._vueMeta) {
        this._vueMeta = true;
        var p = this.$parent;

        while (p && p !== this.$root) {
          if (isUndefined(p._vueMeta)) {
            p._vueMeta = false;
          }

          p = p.$parent;
        }
      } // coerce function-style metaInfo to a computed prop so we can observe
      // it on creation


      if (isFunction(this.$options[options.keyName])) {
        if (!this.$options.computed) {
          this.$options.computed = {};
        }

        this.$options.computed.$metaInfo = this.$options[options.keyName];

        if (!this.$isServer) {
          // if computed $metaInfo exists, watch it for updates & trigger a refresh
          // when it changes (i.e. automatically handle async actions that affect metaInfo)
          // credit for this suggestion goes to [Sébastien Chopin](https://github.com/Atinux)
          ensuredPush(this.$options, 'created', function () {
            _this.$watch('$metaInfo', function () {
              _this.__metaInfo = undefined;
              triggerUpdate(_this, 'watcher');
            });
          });
        }
      } // force an initial refresh on page load and prevent other lifecycleHooks
      // to triggerUpdate until this initial refresh is finished
      // this is to make sure that when a page is opened in an inactive tab which
      // has throttled rAF/timers we still immediately set the page title


      if (isUndefined(this.$root._vueMeta.initialized)) {
        this.$root._vueMeta.initialized = this.$isServer;

        if (!this.$root._vueMeta.initialized) {
          ensuredPush(this.$options, 'beforeMount', function () {
            // if this Vue-app was server rendered, set the appId to 'ssr'
            // only one SSR app per page is supported
            if (_this.$root.$el && _this.$root.$el.hasAttribute && _this.$root.$el.hasAttribute('data-server-rendered')) {
              _this.$root._vueMeta.appId = options.ssrAppId;
            }
          }); // we use the mounted hook here as on page load

          ensuredPush(this.$options, 'mounted', function () {
            if (!_this.$root._vueMeta.initialized) {
              // used in triggerUpdate to check if a change was triggered
              // during initialization
              _this.$root._vueMeta.initializing = true; // refresh meta in nextTick so all child components have loaded

              _this.$nextTick(function () {
                var _this2 = this;

                var _this$$root$$meta$ref = this.$root.$meta().refresh(),
                    tags = _this$$root$$meta$ref.tags,
                    metaInfo = _this$$root$$meta$ref.metaInfo; // After ssr hydration (identifier by tags === false) check
                // if initialized was set to null in triggerUpdate. That'd mean
                // that during initilazation changes where triggered which need
                // to be applied OR a metaInfo watcher was triggered before the
                // current hook was called
                // (during initialization all changes are blocked)


                if (tags === false && this.$root._vueMeta.initialized === null) {
                  this.$nextTick(function () {
                    return triggerUpdate(_this2, 'initializing');
                  });
                }

                this.$root._vueMeta.initialized = true;
                delete this.$root._vueMeta.initializing; // add the navigation guards if they havent been added yet
                // they are needed for the afterNavigation callback

                if (!options.refreshOnceOnNavigation && metaInfo.afterNavigation) {
                  addNavGuards(this);
                }
              });
            }
          }); // add the navigation guards if requested

          if (options.refreshOnceOnNavigation) {
            addNavGuards(this);
          }
        }
      } // do not trigger refresh on the server side


      if (this.$isServer) {
        return;
      } // no need to add this hooks on server side


      updateOnLifecycleHook.forEach(function (lifecycleHook) {
        ensuredPush(_this.$options, lifecycleHook, function () {
          return triggerUpdate(_this, lifecycleHook);
        });
      });
    },
    // TODO: move back into beforeCreate when Vue issue is resolved
    destroyed: function destroyed() {
      var _this3 = this;

      // do not trigger refresh:
      // - on the server side
      // - when the component doesnt have a parent
      // - doesnt have metaInfo defined
      if (this.$isServer || !this.$parent || !hasMetaInfo(this)) {
        return;
      } // Wait that element is hidden before refreshing meta tags (to support animations)


      var interval = setInterval(function () {
        if (_this3.$el && _this3.$el.offsetParent !== null) {
          return;
        }

        clearInterval(interval);
        triggerUpdate(_this3, 'destroyed');
      }, 50);
    }
  };
}

/**
 * These are constant variables used throughout the application.
 */
// set some sane defaults
var defaultInfo = {
  title: undefined,
  titleChunk: '',
  titleTemplate: '%s',
  htmlAttrs: {},
  bodyAttrs: {},
  headAttrs: {},
  base: [],
  link: [],
  meta: [],
  style: [],
  script: [],
  noscript: [],
  __dangerouslyDisableSanitizers: [],
  __dangerouslyDisableSanitizersByTagID: {} // This is the name of the component option that contains all the information that
  // gets converted to the various meta tags & attributes for the page.

};
var keyName = 'metaInfo'; // This is the attribute vue-meta arguments on elements to know which it should
// manage and which it should ignore.

var attribute = 'data-vue-meta'; // This is the attribute that goes on the `html` tag to inform `vue-meta`
// that the server has already generated the meta tags for the initial render.

var ssrAttribute = 'data-vue-meta-server-rendered'; // This is the property that tells vue-meta to overwrite (instead of append)
// an item in a tag list. For example, if you have two `meta` tag list items
// that both have `vmid` of "description", then vue-meta will overwrite the
// shallowest one with the deepest one.

var tagIDKeyName = 'vmid'; // This is the key name for possible meta templates

var metaTemplateKeyName = 'template'; // This is the key name for the content-holding property

var contentKeyName = 'content'; // The id used for the ssr app

var ssrAppId = 'ssr';
var defaultOptions = {
  keyName: keyName,
  attribute: attribute,
  ssrAttribute: ssrAttribute,
  tagIDKeyName: tagIDKeyName,
  contentKeyName: contentKeyName,
  metaTemplateKeyName: metaTemplateKeyName,
  ssrAppId: ssrAppId // List of metaInfo property keys which are configuration options (and dont generate html)

};
var metaInfoOptionKeys = ['titleChunk', 'titleTemplate', 'changed', '__dangerouslyDisableSanitizers', '__dangerouslyDisableSanitizersByTagID']; // The metaInfo property keys which are used to disable escaping

var disableOptionKeys = ['__dangerouslyDisableSanitizers', '__dangerouslyDisableSanitizersByTagID']; // List of metaInfo property keys which only generates attributes and no tags

var metaInfoAttributeKeys = ['htmlAttrs', 'headAttrs', 'bodyAttrs']; // HTML elements which support the onload event

var tagsSupportingOnload = ['link', 'style', 'script']; // HTML elements which dont have a head tag (shortened to our needs)
// see: https://www.w3.org/TR/html52/document-metadata.html

var tagsWithoutEndTag = ['base', 'meta', 'link']; // HTML elements which can have inner content (shortened to our needs)

var tagsWithInnerContent = ['noscript', 'script', 'style']; // Attributes which are inserted as childNodes instead of HTMLAttribute

var tagAttributeAsInnerContent = ['innerHTML', 'cssText', 'json'];
var tagProperties = ['once', 'template']; // Attributes which should be added with data- prefix

var commonDataAttributes = ['body', 'pbody']; // from: https://github.com/kangax/html-minifier/blob/gh-pages/src/htmlminifier.js#L202

var booleanHtmlAttributes = ['allowfullscreen', 'amp', 'async', 'autofocus', 'autoplay', 'checked', 'compact', 'controls', 'declare', 'default', 'defaultchecked', 'defaultmuted', 'defaultselected', 'defer', 'disabled', 'enabled', 'formnovalidate', 'hidden', 'indeterminate', 'inert', 'ismap', 'itemscope', 'loop', 'multiple', 'muted', 'nohref', 'noresize', 'noshade', 'novalidate', 'nowrap', 'open', 'pauseonexit', 'readonly', 'required', 'reversed', 'scoped', 'seamless', 'selected', 'sortable', 'truespeed', 'typemustmatch', 'visible'];

function setOptions(options) {
  // combine options
  options = isObject(options) ? options : {};

  for (var key in defaultOptions) {
    if (!options[key]) {
      options[key] = defaultOptions[key];
    }
  }

  return options;
}
function getOptions(options) {
  var optionsCopy = {};

  for (var key in options) {
    optionsCopy[key] = options[key];
  }

  return optionsCopy;
}

function pause() {
  var refresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  this.$root._vueMeta.paused = true;
  return function () {
    return resume(refresh);
  };
}
function resume() {
  var refresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  this.$root._vueMeta.paused = false;

  if (refresh) {
    return this.$root.$meta().refresh();
  }
}

/*
 * To reduce build size, this file provides simple polyfills without
 * overly excessive type checking and without modifying
 * the global Array.prototype
 * The polyfills are automatically removed in the commonjs build
 * Also, only files in client/ & shared/ should use these functions
 * files in server/ still use normal js function
 */
function findIndex(array, predicate) {
  if ( !Array.prototype.findIndex) {
    // idx needs to be a Number, for..in returns string
    for (var idx = 0; idx < array.length; idx++) {
      if (predicate.call(arguments[2], array[idx], idx, array)) {
        return idx;
      }
    }

    return -1;
  }

  return array.findIndex(predicate, arguments[2]);
}
function toArray(arg) {
  if ( !Array.from) {
    return Array.prototype.slice.call(arg);
  }

  return Array.from(arg);
}
function includes(array, value) {
  if ( !Array.prototype.includes) {
    for (var idx in array) {
      if (array[idx] === value) {
        return true;
      }
    }

    return false;
  }

  return array.includes(value);
}

var serverSequences = [[/&/g, '&amp;'], [/</g, '&lt;'], [/>/g, '&gt;'], [/"/g, '&quot;'], [/'/g, '&#x27;']];
var clientSequences = [[/&/g, "&"], [/</g, "<"], [/>/g, ">"], [/"/g, "\""], [/'/g, "'"]]; // sanitizes potentially dangerous characters

function escape(info, options, escapeOptions, escapeKeys) {
  var tagIDKeyName = options.tagIDKeyName;
  var _escapeOptions$doEsca = escapeOptions.doEscape,
      doEscape = _escapeOptions$doEsca === void 0 ? function (v) {
    return v;
  } : _escapeOptions$doEsca;
  var escaped = {};

  for (var key in info) {
    var value = info[key]; // no need to escape configuration options

    if (includes(metaInfoOptionKeys, key)) {
      escaped[key] = value;
      continue;
    }

    var _disableOptionKeys = _slicedToArray(disableOptionKeys, 1),
        disableKey = _disableOptionKeys[0];

    if (escapeOptions[disableKey] && includes(escapeOptions[disableKey], key)) {
      // this info[key] doesnt need to escaped if the option is listed in __dangerouslyDisableSanitizers
      escaped[key] = value;
      continue;
    }

    var tagId = info[tagIDKeyName];

    if (tagId) {
      disableKey = disableOptionKeys[1]; // keys which are listed in __dangerouslyDisableSanitizersByTagID for the current vmid do not need to be escaped

      if (escapeOptions[disableKey] && escapeOptions[disableKey][tagId] && includes(escapeOptions[disableKey][tagId], key)) {
        escaped[key] = value;
        continue;
      }
    }

    if (isString(value)) {
      escaped[key] = doEscape(value);
    } else if (isArray(value)) {
      escaped[key] = value.map(function (v) {
        if (isPureObject(v)) {
          return escape(v, options, escapeOptions, true);
        }

        return doEscape(v);
      });
    } else if (isPureObject(value)) {
      escaped[key] = escape(value, options, escapeOptions, true);
    } else {
      escaped[key] = value;
    }

    if (escapeKeys) {
      var escapedKey = doEscape(key);

      if (key !== escapedKey) {
        escaped[escapedKey] = escaped[key];
        delete escaped[key];
      }
    }
  }

  return escaped;
}
function escapeMetaInfo(options, info) {
  var escapeSequences = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var escapeOptions = {
    doEscape: function doEscape(value) {
      return escapeSequences.reduce(function (val, _ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            v = _ref2[0],
            r = _ref2[1];

        return val.replace(v, r);
      }, value);
    }
  };
  disableOptionKeys.forEach(function (disableKey, index) {
    if (index === 0) {
      ensureIsArray(info, disableKey);
    } else if (index === 1) {
      for (var key in info[disableKey]) {
        ensureIsArray(info[disableKey], key);
      }
    }

    escapeOptions[disableKey] = info[disableKey];
  }); // begin sanitization

  return escape(info, options, escapeOptions);
}

function applyTemplate(_ref, headObject, template, chunk) {
  var component = _ref.component,
      metaTemplateKeyName = _ref.metaTemplateKeyName,
      contentKeyName = _ref.contentKeyName;

  if (template === true || headObject[metaTemplateKeyName] === true) {
    // abort, template was already applied
    return false;
  }

  if (isUndefined(template) && headObject[metaTemplateKeyName]) {
    template = headObject[metaTemplateKeyName];
    headObject[metaTemplateKeyName] = true;
  } // return early if no template defined


  if (!template) {
    // cleanup faulty template properties
    if (headObject.hasOwnProperty(metaTemplateKeyName)) {
      delete headObject[metaTemplateKeyName];
    }

    return false;
  }

  if (isUndefined(chunk)) {
    chunk = headObject[contentKeyName];
  }

  headObject[contentKeyName] = isFunction(template) ? template.call(component, chunk) : template.replace(/%s/g, chunk);
  return true;
}

function _arrayMerge(_ref, target, source) {
  var component = _ref.component,
      tagIDKeyName = _ref.tagIDKeyName,
      metaTemplateKeyName = _ref.metaTemplateKeyName,
      contentKeyName = _ref.contentKeyName;
  // we concat the arrays without merging objects contained in,
  // but we check for a `vmid` property on each object in the array
  // using an O(1) lookup associative array exploit
  var destination = [];

  if (!target.length && !source.length) {
    return destination;
  }

  target.forEach(function (targetItem, targetIndex) {
    // no tagID so no need to check for duplicity
    if (!targetItem[tagIDKeyName]) {
      destination.push(targetItem);
      return;
    }

    var sourceIndex = findIndex(source, function (item) {
      return item[tagIDKeyName] === targetItem[tagIDKeyName];
    });
    var sourceItem = source[sourceIndex]; // source doesnt contain any duplicate vmid's, we can keep targetItem

    if (sourceIndex === -1) {
      destination.push(targetItem);
      return;
    } // when sourceItem explictly defines contentKeyName or innerHTML as undefined, its
    // an indication that we need to skip the default behaviour or child has preference over parent
    // which means we keep the targetItem and ignore/remove the sourceItem


    if (sourceItem.hasOwnProperty(contentKeyName) && sourceItem[contentKeyName] === undefined || sourceItem.hasOwnProperty('innerHTML') && sourceItem.innerHTML === undefined) {
      destination.push(targetItem); // remove current index from source array so its not concatenated to destination below

      source.splice(sourceIndex, 1);
      return;
    } // we now know that targetItem is a duplicate and we should ignore it in favor of sourceItem
    // if source specifies null as content then ignore both the target as the source


    if (sourceItem[contentKeyName] === null || sourceItem.innerHTML === null) {
      // remove current index from source array so its not concatenated to destination below
      source.splice(sourceIndex, 1);
      return;
    } // now we only need to check if the target has a template to combine it with the source


    var targetTemplate = targetItem[metaTemplateKeyName];

    if (!targetTemplate) {
      return;
    }

    var sourceTemplate = sourceItem[metaTemplateKeyName];

    if (!sourceTemplate) {
      // use parent template and child content
      applyTemplate({
        component: component,
        metaTemplateKeyName: metaTemplateKeyName,
        contentKeyName: contentKeyName
      }, sourceItem, targetTemplate); // set template to true to indicate template was already applied

      sourceItem.template = true;
      return;
    }

    if (!sourceItem[contentKeyName]) {
      // use parent content and child template
      applyTemplate({
        component: component,
        metaTemplateKeyName: metaTemplateKeyName,
        contentKeyName: contentKeyName
      }, sourceItem, undefined, targetItem[contentKeyName]);
    }
  });
  return destination.concat(source);
}
function merge(target, source) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  // remove properties explicitly set to false so child components can
  // optionally _not_ overwrite the parents content
  // (for array properties this is checked in arrayMerge)
  if (source.hasOwnProperty('title') && source.title === undefined) {
    delete source.title;
  }

  metaInfoAttributeKeys.forEach(function (attrKey) {
    if (!source[attrKey]) {
      return;
    }

    for (var key in source[attrKey]) {
      if (source[attrKey].hasOwnProperty(key) && source[attrKey][key] === undefined) {
        if (includes(booleanHtmlAttributes, key)) {
          warn('VueMeta: Please note that since v2 the value undefined is not used to indicate boolean attributes anymore, see migration guide for details');
        }

        delete source[attrKey][key];
      }
    }
  });
  return deepmerge(target, source, {
    arrayMerge: function arrayMerge(t, s) {
      return _arrayMerge(options, t, s);
    }
  });
}

function getComponentMetaInfo() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var component = arguments.length > 1 ? arguments[1] : undefined;
  return getComponentOption(options, component, defaultInfo);
}
/**
 * Returns the `opts.option` $option value of the given `opts.component`.
 * If methods are encountered, they will be bound to the component context.
 * If `opts.deep` is true, will recursively merge all child component
 * `opts.option` $option values into the returned result.
 *
 * @param  {Object} opts - options
 * @param  {Object} opts.component - Vue component to fetch option data from
 * @param  {Boolean} opts.deep - look for data in child components as well?
 * @param  {Function} opts.arrayMerge - how should arrays be merged?
 * @param  {String} opts.keyName - the name of the option to look for
 * @param  {Object} [result={}] - result so far
 * @return {Object} result - final aggregated result
 */

function getComponentOption() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var component = arguments.length > 1 ? arguments[1] : undefined;
  var result = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var keyName = options.keyName;
  var $options = component.$options,
      $children = component.$children;

  if (component._inactive) {
    return result;
  } // only collect option data if it exists


  if ($options[keyName]) {
    var data = $options[keyName]; // if option is a function, replace it with it's result

    if (isFunction(data)) {
      data = data.call(component);
    } // ignore data if its not an object, then we keep our previous result


    if (!isObject(data)) {
      return result;
    } // merge with existing options


    result = merge(result, data, options);
  } // collect & aggregate child options if deep = true


  if ($children.length) {
    $children.forEach(function (childComponent) {
      // check if the childComponent is in a branch
      // return otherwise so we dont walk all component branches unnecessarily
      if (!inMetaInfoBranch(childComponent)) {
        return;
      }

      result = getComponentOption(options, childComponent, result);
    });
  }

  return result;
}

/**
 * Returns the correct meta info for the given component
 * (child components will overwrite parent meta info)
 *
 * @param  {Object} component - the Vue instance to get meta info from
 * @return {Object} - returned meta info
 */

function getMetaInfo() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var info = arguments.length > 1 ? arguments[1] : undefined;
  var escapeSequences = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var component = arguments.length > 3 ? arguments[3] : undefined;
  var tagIDKeyName = options.tagIDKeyName; // Remove all "template" tags from meta
  // backup the title chunk in case user wants access to it

  if (info.title) {
    info.titleChunk = info.title;
  } // replace title with populated template


  if (info.titleTemplate && info.titleTemplate !== '%s') {
    applyTemplate({
      component: component,
      contentKeyName: 'title'
    }, info, info.titleTemplate, info.titleChunk || '');
  } // convert base tag to an array so it can be handled the same way
  // as the other tags


  if (info.base) {
    info.base = Object.keys(info.base).length ? [info.base] : [];
  }

  if (info.meta) {
    // remove meta items with duplicate vmid's
    info.meta = info.meta.filter(function (metaItem, index, arr) {
      var hasVmid = metaItem.hasOwnProperty(tagIDKeyName);

      if (!hasVmid) {
        return true;
      }

      var isFirstItemForVmid = index === findIndex(arr, function (item) {
        return item[tagIDKeyName] === metaItem[tagIDKeyName];
      });
      return isFirstItemForVmid;
    }); // apply templates if needed

    info.meta.forEach(function (metaObject) {
      return applyTemplate(options, metaObject);
    });
  }

  return escapeMetaInfo(options, info, escapeSequences);
}

function getTag(tags, tag) {
  if (!tags[tag]) {
    tags[tag] = document.getElementsByTagName(tag)[0];
  }

  return tags[tag];
}
function getElementsKey(_ref) {
  var body = _ref.body,
      pbody = _ref.pbody;
  return body ? 'body' : pbody ? 'pbody' : 'head';
}
function queryElements(parentNode, _ref2) {
  var appId = _ref2.appId,
      attribute = _ref2.attribute,
      type = _ref2.type,
      tagIDKeyName = _ref2.tagIDKeyName;
  var attributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var queries = ["".concat(type, "[").concat(attribute, "=\"").concat(appId, "\"]"), "".concat(type, "[data-").concat(tagIDKeyName, "]")].map(function (query) {
    for (var key in attributes) {
      var val = attributes[key];
      var attributeValue = val && val !== true ? "=\"".concat(val, "\"") : '';
      query += "[data-".concat(key).concat(attributeValue, "]");
    }

    return query;
  });
  return toArray(parentNode.querySelectorAll(queries.join(', ')));
}

var callbacks = [];
function isDOMComplete() {
  var d = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  return d.readyState === 'complete';
}
function addCallback(query, callback) {
  if (arguments.length === 1) {
    callback = query;
    query = '';
  }

  callbacks.push([query, callback]);
}
function addCallbacks(_ref, type, tags, autoAddListeners) {
  var tagIDKeyName = _ref.tagIDKeyName;
  var hasAsyncCallback = false;
  tags.forEach(function (tag) {
    if (!tag[tagIDKeyName] || !tag.callback) {
      return;
    }

    hasAsyncCallback = true;
    addCallback("".concat(type, "[data-").concat(tagIDKeyName, "=\"").concat(tag[tagIDKeyName], "\"]"), tag.callback);
  });

  if (!autoAddListeners || !hasAsyncCallback) {
    return hasAsyncCallback;
  }

  return addListeners();
}
function addListeners() {
  if (isDOMComplete()) {
    applyCallbacks();
    return;
  } // Instead of using a MutationObserver, we just apply

  /* istanbul ignore next */


  document.onreadystatechange = function () {
    applyCallbacks();
  };
}
function applyCallbacks(matchElement) {
  callbacks.forEach(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        query = _ref3[0],
        callback = _ref3[1];

    var selector = "".concat(query, "[onload=\"this.__vm_l=1\"]");
    var elements = [];

    if (!matchElement) {
      elements = toArray(document.querySelectorAll(selector));
    }

    if (matchElement && matchElement.matches(selector)) {
      elements = [matchElement];
    }

    elements.forEach(function (element) {
      /* __vm_cb: whether the load callback has been called
       * __vm_l: set by onload attribute, whether the element was loaded
       * __vm_ev: whether the event listener was added or not
       */
      if (element.__vm_cb) {
        return;
      }

      var onload = function onload() {
        /* Mark that the callback for this element has already been called,
         * this prevents the callback to run twice in some (rare) conditions
         */
        element.__vm_cb = true;
        /* onload needs to be removed because we only need the
         * attribute after ssr and if we dont remove it the node
         * will fail isEqualNode on the client
         */

        element.removeAttribute('onload');
        callback(element);
      };
      /* IE9 doesnt seem to load scripts synchronously,
       * causing a script sometimes/often already to be loaded
       * when we add the event listener below (thus adding an onload event
       * listener has no use because it will never be triggered).
       * Therefore we add the onload attribute during ssr, and
       * check here if it was already loaded or not
       */


      if (element.__vm_l) {
        onload();
        return;
      }

      if (!element.__vm_ev) {
        element.__vm_ev = true;
        element.addEventListener('load', onload);
      }
    });
  });
}

/**
 * Updates the document's html tag attributes
 *
 * @param  {Object} attrs - the new document html attributes
 * @param  {HTMLElement} tag - the HTMLElement tag to update with new attrs
 */

function updateAttribute() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      attribute = _ref.attribute;

  var attrs = arguments.length > 1 ? arguments[1] : undefined;
  var tag = arguments.length > 2 ? arguments[2] : undefined;
  var vueMetaAttrString = tag.getAttribute(attribute);
  var vueMetaAttrs = vueMetaAttrString ? vueMetaAttrString.split(',') : [];
  var toRemove = toArray(vueMetaAttrs);
  var keepIndexes = [];

  for (var attr in attrs) {
    if (attrs.hasOwnProperty(attr)) {
      var value = includes(booleanHtmlAttributes, attr) ? '' : isArray(attrs[attr]) ? attrs[attr].join(' ') : attrs[attr];
      tag.setAttribute(attr, value || '');

      if (!includes(vueMetaAttrs, attr)) {
        vueMetaAttrs.push(attr);
      } // filter below wont ever check -1


      keepIndexes.push(toRemove.indexOf(attr));
    }
  }

  var removedAttributesCount = toRemove.filter(function (el, index) {
    return !includes(keepIndexes, index);
  }).reduce(function (acc, attr) {
    tag.removeAttribute(attr);
    return acc + 1;
  }, 0);

  if (vueMetaAttrs.length === removedAttributesCount) {
    tag.removeAttribute(attribute);
  } else {
    tag.setAttribute(attribute, vueMetaAttrs.sort().join(','));
  }
}

/**
 * Updates the document title
 *
 * @param  {String} title - the new title of the document
 */
function updateTitle(title) {
  if (!title && title !== '') {
    return;
  }

  document.title = title;
}

/**
 * Updates meta tags inside <head> and <body> on the client. Borrowed from `react-helmet`:
 * https://github.com/nfl/react-helmet/blob/004d448f8de5f823d10f838b02317521180f34da/src/Helmet.js#L195-L245
 *
 * @param  {('meta'|'base'|'link'|'style'|'script'|'noscript')} type - the name of the tag
 * @param  {(Array<Object>|Object)} tags - an array of tag objects or a single object in case of base
 * @return {Object} - a representation of what tags changed
 */

function updateTag(appId) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var type = arguments.length > 2 ? arguments[2] : undefined;
  var tags = arguments.length > 3 ? arguments[3] : undefined;
  var head = arguments.length > 4 ? arguments[4] : undefined;
  var body = arguments.length > 5 ? arguments[5] : undefined;
  var attribute = options.attribute,
      tagIDKeyName = options.tagIDKeyName;
  var dataAttributes = commonDataAttributes.slice();
  dataAttributes.push(tagIDKeyName);
  var newElements = [];
  var queryOptions = {
    appId: appId,
    attribute: attribute,
    type: type,
    tagIDKeyName: tagIDKeyName
  };
  var currentElements = {
    head: queryElements(head, queryOptions),
    pbody: queryElements(body, queryOptions, {
      pbody: true
    }),
    body: queryElements(body, queryOptions, {
      body: true
    })
  };

  if (tags.length > 1) {
    // remove duplicates that could have been found by merging tags
    // which include a mixin with metaInfo and that mixin is used
    // by multiple components on the same page
    var found = [];
    tags = tags.filter(function (x) {
      var k = JSON.stringify(x);
      var res = !includes(found, k);
      found.push(k);
      return res;
    });
  }

  tags.forEach(function (tag) {
    if (tag.skip) {
      return;
    }

    var newElement = document.createElement(type);
    newElement.setAttribute(attribute, appId);

    var _loop = function _loop(attr) {
      /* istanbul ignore next */
      if (!tag.hasOwnProperty(attr) || includes(tagProperties, attr)) {
        return "continue";
      }

      if (attr === 'innerHTML') {
        newElement.innerHTML = tag.innerHTML;
        return "continue";
      }

      if (attr === 'json') {
        newElement.innerHTML = JSON.stringify(tag.json);
        return "continue";
      }

      if (attr === 'cssText') {
        if (newElement.styleSheet) {
          /* istanbul ignore next */
          newElement.styleSheet.cssText = tag.cssText;
        } else {
          newElement.appendChild(document.createTextNode(tag.cssText));
        }

        return "continue";
      }

      if (attr === 'callback') {
        newElement.onload = function () {
          return tag[attr](newElement);
        };

        return "continue";
      }

      var _attr = includes(dataAttributes, attr) ? "data-".concat(attr) : attr;

      var isBooleanAttribute = includes(booleanHtmlAttributes, attr);

      if (isBooleanAttribute && !tag[attr]) {
        return "continue";
      }

      var value = isBooleanAttribute ? '' : tag[attr];
      newElement.setAttribute(_attr, value);
    };

    for (var attr in tag) {
      var _ret = _loop(attr);

      if (_ret === "continue") continue;
    }

    var oldElements = currentElements[getElementsKey(tag)]; // Remove a duplicate tag from domTagstoRemove, so it isn't cleared.

    var indexToDelete;
    var hasEqualElement = oldElements.some(function (existingTag, index) {
      indexToDelete = index;
      return newElement.isEqualNode(existingTag);
    });

    if (hasEqualElement && (indexToDelete || indexToDelete === 0)) {
      oldElements.splice(indexToDelete, 1);
    } else {
      newElements.push(newElement);
    }
  });
  var oldElements = [];

  for (var _type in currentElements) {
    Array.prototype.push.apply(oldElements, currentElements[_type]);
  } // remove old elements


  oldElements.forEach(function (element) {
    element.parentNode.removeChild(element);
  }); // insert new elements

  newElements.forEach(function (element) {
    if (element.hasAttribute('data-body')) {
      body.appendChild(element);
      return;
    }

    if (element.hasAttribute('data-pbody')) {
      body.insertBefore(element, body.firstChild);
      return;
    }

    head.appendChild(element);
  });
  return {
    oldTags: oldElements,
    newTags: newElements
  };
}

/**
 * Performs client-side updates when new meta info is received
 *
 * @param  {Object} newInfo - the meta info to update to
 */

function updateClientMetaInfo(appId) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var newInfo = arguments.length > 2 ? arguments[2] : undefined;
  var ssrAttribute = options.ssrAttribute,
      ssrAppId = options.ssrAppId; // only cache tags for current update

  var tags = {};
  var htmlTag = getTag(tags, 'html'); // if this is a server render, then dont update

  if (appId === ssrAppId && htmlTag.hasAttribute(ssrAttribute)) {
    // remove the server render attribute so we can update on (next) changes
    htmlTag.removeAttribute(ssrAttribute); // add load callbacks if the

    var addLoadListeners = false;
    tagsSupportingOnload.forEach(function (type) {
      if (newInfo[type] && addCallbacks(options, type, newInfo[type])) {
        addLoadListeners = true;
      }
    });

    if (addLoadListeners) {
      addListeners();
    }

    return false;
  } // initialize tracked changes


  var addedTags = {};
  var removedTags = {};

  for (var type in newInfo) {
    // ignore these
    if (includes(metaInfoOptionKeys, type)) {
      continue;
    }

    if (type === 'title') {
      // update the title
      updateTitle(newInfo.title);
      continue;
    }

    if (includes(metaInfoAttributeKeys, type)) {
      var tagName = type.substr(0, 4);
      updateAttribute(options, newInfo[type], getTag(tags, tagName));
      continue;
    } // tags should always be an array, ignore if it isnt


    if (!isArray(newInfo[type])) {
      continue;
    }

    var _updateTag = updateTag(appId, options, type, newInfo[type], getTag(tags, 'head'), getTag(tags, 'body')),
        oldTags = _updateTag.oldTags,
        newTags = _updateTag.newTags;

    if (newTags.length) {
      addedTags[type] = newTags;
      removedTags[type] = oldTags;
    }
  }

  return {
    addedTags: addedTags,
    removedTags: removedTags
  };
}

function _refresh() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  /**
   * When called, will update the current meta info with new meta info.
   * Useful when updating meta info as the result of an asynchronous
   * action that resolves after the initial render takes place.
   *
   * Credit to [Sébastien Chopin](https://github.com/Atinux) for the suggestion
   * to implement this method.
   *
   * @return {Object} - new meta info
   */
  return function refresh() {
    // collect & aggregate all metaInfo $options
    var rawInfo = getComponentMetaInfo(options, this.$root);
    var metaInfo = getMetaInfo(options, rawInfo, clientSequences, this.$root);
    var appId = this.$root._vueMeta.appId;
    var tags = updateClientMetaInfo(appId, options, metaInfo); // emit "event" with new info

    if (tags && isFunction(metaInfo.changed)) {
      metaInfo.changed(metaInfo, tags.addedTags, tags.removedTags);
    }

    return {
      vm: this,
      metaInfo: metaInfo,
      tags: tags
    };
  };
}

/**
 * Generates tag attributes for use on the server.
 *
 * @param  {('bodyAttrs'|'htmlAttrs'|'headAttrs')} type - the type of attributes to generate
 * @param  {Object} data - the attributes to generate
 * @return {Object} - the attribute generator
 */

function attributeGenerator() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      attribute = _ref.attribute,
      ssrAttribute = _ref.ssrAttribute;

  var type = arguments.length > 1 ? arguments[1] : undefined;
  var data = arguments.length > 2 ? arguments[2] : undefined;
  return {
    text: function text(addSrrAttribute) {
      var attributeStr = '';
      var watchedAttrs = [];

      for (var attr in data) {
        if (data.hasOwnProperty(attr)) {
          watchedAttrs.push(attr);
          attributeStr += isUndefined(data[attr]) || booleanHtmlAttributes.includes(attr) ? attr : "".concat(attr, "=\"").concat(isArray(data[attr]) ? data[attr].join(' ') : data[attr], "\"");
          attributeStr += ' ';
        }
      }

      if (attributeStr) {
        attributeStr += "".concat(attribute, "=\"").concat(watchedAttrs.sort().join(','), "\"");
      }

      if (type === 'htmlAttrs' && addSrrAttribute) {
        return "".concat(ssrAttribute).concat(attributeStr ? ' ' : '').concat(attributeStr);
      }

      return attributeStr;
    }
  };
}

/**
 * Generates title output for the server
 *
 * @param  {'title'} type - the string "title"
 * @param  {String} data - the title text
 * @return {Object} - the title generator
 */
function titleGenerator() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      attribute = _ref.attribute;

  var type = arguments.length > 1 ? arguments[1] : undefined;
  var data = arguments.length > 2 ? arguments[2] : undefined;
  return {
    text: function text() {
      if (!data) {
        return '';
      }

      return "<".concat(type, ">").concat(data, "</").concat(type, ">");
    }
  };
}

/**
 * Generates meta, base, link, style, script, noscript tags for use on the server
 *
 * @param  {('meta'|'base'|'link'|'style'|'script'|'noscript')} the name of the tag
 * @param  {(Array<Object>|Object)} tags - an array of tag objects or a single object in case of base
 * @return {Object} - the tag generator
 */

function tagGenerator() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      ssrAppId = _ref.ssrAppId,
      attribute = _ref.attribute,
      tagIDKeyName = _ref.tagIDKeyName;

  var type = arguments.length > 1 ? arguments[1] : undefined;
  var tags = arguments.length > 2 ? arguments[2] : undefined;
  var dataAttributes = [tagIDKeyName].concat(_toConsumableArray(commonDataAttributes));
  return {
    text: function text() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref2$body = _ref2.body,
          body = _ref2$body === void 0 ? false : _ref2$body,
          _ref2$pbody = _ref2.pbody,
          pbody = _ref2$pbody === void 0 ? false : _ref2$pbody;

      if (!tags || !tags.length) {
        return '';
      } // build a string containing all tags of this type


      return tags.reduce(function (tagsStr, tag) {
        if (tag.skip) {
          return tagsStr;
        }

        var tagKeys = Object.keys(tag);

        if (tagKeys.length === 0) {
          return tagsStr; // Bail on empty tag object
        }

        if (Boolean(tag.body) !== body || Boolean(tag.pbody) !== pbody) {
          return tagsStr;
        }

        var attrs = tag.once ? '' : " ".concat(attribute, "=\"").concat(ssrAppId, "\""); // build a string containing all attributes of this tag

        for (var attr in tag) {
          // these attributes are treated as children on the tag
          if (tagAttributeAsInnerContent.includes(attr) || tagProperties.includes(attr)) {
            continue;
          }

          if (attr === 'callback') {
            attrs += " onload=\"this.__vm_l=1\"";
            continue;
          } // these form the attribute list for this tag


          var prefix = '';

          if (dataAttributes.includes(attr)) {
            prefix = 'data-';
          }

          var isBooleanAttr = !prefix && booleanHtmlAttributes.includes(attr);

          if (isBooleanAttr && !tag[attr]) {
            continue;
          }

          attrs += " ".concat(prefix).concat(attr) + (isBooleanAttr ? '' : "=\"".concat(tag[attr], "\""));
        }

        var json = '';

        if (tag.json) {
          json = JSON.stringify(tag.json);
        } // grab child content from one of these attributes, if possible


        var content = tag.innerHTML || tag.cssText || json; // generate tag exactly without any other redundant attribute
        // these tags have no end tag

        var hasEndTag = !tagsWithoutEndTag.includes(type); // these tag types will have content inserted

        var hasContent = hasEndTag && tagsWithInnerContent.includes(type); // the final string for this specific tag

        return "".concat(tagsStr, "<").concat(type).concat(attrs).concat(!hasContent && hasEndTag ? '/' : '', ">") + (hasContent ? "".concat(content, "</").concat(type, ">") : '');
      }, '');
    }
  };
}

/**
 * Converts a meta info property to one that can be stringified on the server
 *
 * @param  {String} type - the type of data to convert
 * @param  {(String|Object|Array<Object>)} data - the data value
 * @return {Object} - the new injector
 */

function generateServerInjector(options, newInfo) {
  for (var type in defaultInfo) {
    if (metaInfoOptionKeys.includes(type)) {
      continue;
    }

    if (type === 'title') {
      newInfo[type] = titleGenerator(options, type, newInfo[type]);
      continue;
    }

    if (metaInfoAttributeKeys.includes(type)) {
      newInfo[type] = attributeGenerator(options, type, newInfo[type]);
      continue;
    }

    newInfo[type] = tagGenerator(options, type, newInfo[type]);
  }

  return newInfo;
}

function _inject() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  /**
   * Converts the state of the meta info object such that each item
   * can be compiled to a tag string on the server
   *
   * @this {Object} - Vue instance - ideally the root component
   * @return {Object} - server meta info with `toString` methods
   */
  return function inject() {
    // collect & aggregate all metaInfo $options
    var rawInfo = getComponentMetaInfo(options, this.$root);
    var metaInfo = getMetaInfo(options, rawInfo, serverSequences, this.$root); // generate server injectors

    generateServerInjector(options, metaInfo);
    return metaInfo;
  };
}

function _$meta() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _refresh$1 = _refresh(options);

  var _inject$1 = _inject(options);
  /**
   * Returns an injector for server-side rendering.
   * @this {Object} - the Vue instance (a root component)
   * @return {Object} - injector
   */


  return function $meta() {
    return {
      getOptions: function getOptions$1() {
        return getOptions(options);
      },
      refresh: _refresh$1.bind(this),
      inject: _inject$1.bind(this),
      pause: pause.bind(this),
      resume: resume.bind(this)
    };
  };
}

function generate(rawInfo) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var metaInfo = getMetaInfo(setOptions(options), rawInfo, serverSequences);
  return generateServerInjector(options, metaInfo);
}

/**
 * Plugin install function.
 * @param {Function} Vue - the Vue constructor.
 */

function install(Vue) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (Vue.__vuemeta_installed) {
    return;
  }

  Vue.__vuemeta_installed = true;
  options = setOptions(options);
  Vue.prototype.$meta = _$meta(options);
  Vue.mixin(createMixin(Vue, options));
}

var index = {
  version: version,
  install: install,
  hasMetaInfo: hasMetaInfo,
  generate: generate
};

export default index;
