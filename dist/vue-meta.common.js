/**
 * vue-meta v2.1.0
 * (c) 2019
 * - Declan de Wet
 * - Sébastien Chopin (@Atinux)
  * - All the amazing contributors
 * @license MIT
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var deepmerge = _interopDefault(require('deepmerge'));

var version = "2.1.0";

// store an id to keep track of DOM updates
let batchId = null;
function triggerUpdate(vm, hookName) {
  // if an update was triggered during initialization or when an update was triggered by the
  // metaInfo watcher, set initialized to null
  // then we keep falsy value but know we need to run a triggerUpdate after initialization
  if (!vm.$root._vueMeta.initialized && (vm.$root._vueMeta.initializing || hookName === 'watcher')) {
    vm.$root._vueMeta.initialized = null;
  }

  if (vm.$root._vueMeta.initialized && !vm.$root._vueMeta.paused) {
    // batch potential DOM updates to prevent extraneous re-rendering
    batchUpdate(() => vm.$meta().refresh());
  }
}
/**
 * Performs a batched update.
 *
 * @param  {(null|Number)} id - the ID of this update
 * @param  {Function} callback - the update to perform
 * @return {Number} id - a new ID
 */

function batchUpdate(callback, timeout = 10) {
  clearTimeout(batchId);
  batchId = setTimeout(() => {
    callback();
  }, timeout);
  return batchId;
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
  return typeof arg === 'object';
}
function isPureObject(arg) {
  return typeof arg === 'object' && arg !== null;
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

function hasMetaInfo(vm = this) {
  return vm && (vm._vueMeta === true || isObject(vm._vueMeta));
} // a component is in a metaInfo branch when itself has meta info or one of its (grand-)children has

function inMetaInfoBranch(vm = this) {
  return vm && !isUndefined(vm._vueMeta);
}

function addNavGuards(vm) {
  // return when nav guards already added or no router exists
  if (vm.$root._vueMeta.navGuards || !vm.$root.$router) {
    /* istanbul ignore next */
    return;
  }

  vm.$root._vueMeta.navGuards = true;
  const $router = vm.$root.$router;
  const $meta = vm.$root.$meta();
  $router.beforeEach((to, from, next) => {
    $meta.pause();
    next();
  });
  $router.afterEach(() => {
    const {
      metaInfo
    } = $meta.resume();

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
const hasGlobalWindow = hasGlobalWindowFn();

const _global = hasGlobalWindow ? window : global;

const console = _global.console = _global.console || {};
function warn(...args) {
  /* istanbul ignore next */
  if (!console || !console.warn) {
    return;
  }

  console.warn(...args);
}

let appId = 1;
function createMixin(Vue, options) {
  // for which Vue lifecycle hooks should the metaInfo be refreshed
  const updateOnLifecycleHook = ['activated', 'deactivated', 'beforeMount']; // watch for client side component updates

  return {
    beforeCreate() {
      Object.defineProperty(this, '_hasMetaInfo', {
        configurable: true,

        get() {
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

      if (!isUndefined(this.$options[options.keyName]) && this.$options[options.keyName] !== null) {
        if (!this.$root._vueMeta) {
          this.$root._vueMeta = {
            appId
          };
          appId++;
        } // to speed up updates we keep track of branches which have a component with vue-meta info defined
        // if _vueMeta = true it has info, if _vueMeta = false a child has info


        if (!this._vueMeta) {
          this._vueMeta = true;
          let p = this.$parent;

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
            ensuredPush(this.$options, 'created', () => {
              this.$watch('$metaInfo', function () {
                triggerUpdate(this, 'watcher');
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
            ensuredPush(this.$options, 'beforeMount', () => {
              // if this Vue-app was server rendered, set the appId to 'ssr'
              // only one SSR app per page is supported
              if (this.$root.$el && this.$root.$el.hasAttribute && this.$root.$el.hasAttribute('data-server-rendered')) {
                this.$root._vueMeta.appId = options.ssrAppId;
              }
            }); // we use the mounted hook here as on page load

            ensuredPush(this.$options, 'mounted', () => {
              if (!this.$root._vueMeta.initialized) {
                // used in triggerUpdate to check if a change was triggered
                // during initialization
                this.$root._vueMeta.initializing = true; // refresh meta in nextTick so all child components have loaded

                this.$nextTick(function () {
                  const {
                    tags,
                    metaInfo
                  } = this.$root.$meta().refresh(); // After ssr hydration (identifier by tags === false) check
                  // if initialized was set to null in triggerUpdate. That'd mean
                  // that during initilazation changes where triggered which need
                  // to be applied OR a metaInfo watcher was triggered before the
                  // current hook was called
                  // (during initialization all changes are blocked)

                  if (tags === false && this.$root._vueMeta.initialized === null) {
                    this.$nextTick(() => triggerUpdate(this, 'initializing'));
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


        if (!this.$isServer) {
          // no need to add this hooks on server side
          updateOnLifecycleHook.forEach(lifecycleHook => {
            ensuredPush(this.$options, lifecycleHook, () => triggerUpdate(this, lifecycleHook));
          }); // re-render meta data when returning from a child component to parent

          ensuredPush(this.$options, 'destroyed', () => {
            // Wait that element is hidden before refreshing meta tags (to support animations)
            const interval = setInterval(() => {
              if (this.$el && this.$el.offsetParent !== null) {
                /* istanbul ignore next line */
                return;
              }

              clearInterval(interval);

              if (!this.$parent) {
                /* istanbul ignore next line */
                return;
              }

              triggerUpdate(this, 'destroyed');
            }, 50);
          });
        }
      }
    }

  };
}

/**
 * These are constant variables used throughout the application.
 */
// set some sane defaults
const defaultInfo = {
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
const keyName = 'metaInfo'; // This is the attribute vue-meta arguments on elements to know which it should
// manage and which it should ignore.

const attribute = 'data-vue-meta'; // This is the attribute that goes on the `html` tag to inform `vue-meta`
// that the server has already generated the meta tags for the initial render.

const ssrAttribute = 'data-vue-meta-server-rendered'; // This is the property that tells vue-meta to overwrite (instead of append)
// an item in a tag list. For example, if you have two `meta` tag list items
// that both have `vmid` of "description", then vue-meta will overwrite the
// shallowest one with the deepest one.

const tagIDKeyName = 'vmid'; // This is the key name for possible meta templates

const metaTemplateKeyName = 'template'; // This is the key name for the content-holding property

const contentKeyName = 'content'; // The id used for the ssr app

const ssrAppId = 'ssr';
const defaultOptions = {
  keyName,
  attribute,
  ssrAttribute,
  tagIDKeyName,
  contentKeyName,
  metaTemplateKeyName,
  ssrAppId // List of metaInfo property keys which are configuration options (and dont generate html)

};
const metaInfoOptionKeys = ['titleChunk', 'titleTemplate', 'changed', '__dangerouslyDisableSanitizers', '__dangerouslyDisableSanitizersByTagID']; // The metaInfo property keys which are used to disable escaping

const disableOptionKeys = ['__dangerouslyDisableSanitizers', '__dangerouslyDisableSanitizersByTagID']; // List of metaInfo property keys which only generates attributes and no tags

const metaInfoAttributeKeys = ['htmlAttrs', 'headAttrs', 'bodyAttrs']; // HTML elements which support the onload event

const tagsSupportingOnload = ['link', 'style', 'script']; // HTML elements which dont have a head tag (shortened to our needs)
// see: https://www.w3.org/TR/html52/document-metadata.html

const tagsWithoutEndTag = ['base', 'meta', 'link']; // HTML elements which can have inner content (shortened to our needs)

const tagsWithInnerContent = ['noscript', 'script', 'style']; // Attributes which are inserted as childNodes instead of HTMLAttribute

const tagAttributeAsInnerContent = ['innerHTML', 'cssText', 'json']; // Attributes which should be added with data- prefix

const commonDataAttributes = ['body', 'pbody']; // from: https://github.com/kangax/html-minifier/blob/gh-pages/src/htmlminifier.js#L202

const booleanHtmlAttributes = ['allowfullscreen', 'amp', 'async', 'autofocus', 'autoplay', 'checked', 'compact', 'controls', 'declare', 'default', 'defaultchecked', 'defaultmuted', 'defaultselected', 'defer', 'disabled', 'enabled', 'formnovalidate', 'hidden', 'indeterminate', 'inert', 'ismap', 'itemscope', 'loop', 'multiple', 'muted', 'nohref', 'noresize', 'noshade', 'novalidate', 'nowrap', 'open', 'pauseonexit', 'readonly', 'required', 'reversed', 'scoped', 'seamless', 'selected', 'sortable', 'truespeed', 'typemustmatch', 'visible'];

function setOptions(options) {
  // combine options
  options = isObject(options) ? options : {};

  for (const key in defaultOptions) {
    if (!options[key]) {
      options[key] = defaultOptions[key];
    }
  }

  return options;
}
function getOptions(options) {
  const optionsCopy = {};

  for (const key in options) {
    optionsCopy[key] = options[key];
  }

  return optionsCopy;
}

function pause(refresh = true) {
  this.$root._vueMeta.paused = true;
  return () => resume(refresh);
}
function resume(refresh = true) {
  this.$root._vueMeta.paused = false;

  if (refresh) {
    return this.$root.$meta().refresh();
  }
}

function applyTemplate({
  component,
  metaTemplateKeyName,
  contentKeyName
}, headObject, template, chunk) {
  if (isUndefined(template)) {
    template = headObject[metaTemplateKeyName];
    delete headObject[metaTemplateKeyName];
  } // return early if no template defined


  if (!template) {
    return false;
  }

  if (isUndefined(chunk)) {
    chunk = headObject[contentKeyName];
  }

  headObject[contentKeyName] = isFunction(template) ? template.call(component, chunk) : template.replace(/%s/g, chunk);
  return true;
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
    for (let idx = 0; idx < array.length; idx++) {
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
    for (const idx in array) {
      if (array[idx] === value) {
        return true;
      }
    }

    return false;
  }

  return array.includes(value);
}

const serverSequences = [[/&/g, '&amp;'], [/</g, '&lt;'], [/>/g, '&gt;'], [/"/g, '&quot;'], [/'/g, '&#x27;']];
const clientSequences = [[/&/g, '\u0026'], [/</g, '\u003C'], [/>/g, '\u003E'], [/"/g, '\u0022'], [/'/g, '\u0027']]; // sanitizes potentially dangerous characters

function escape(info, options, escapeOptions) {
  const {
    tagIDKeyName
  } = options;
  const {
    doEscape = v => v,
    escapeKeys
  } = escapeOptions;
  const escaped = {};

  for (const key in info) {
    const value = info[key]; // no need to escape configuration options

    if (includes(metaInfoOptionKeys, key)) {
      escaped[key] = value;
      continue;
    }

    let [disableKey] = disableOptionKeys;

    if (escapeOptions[disableKey] && includes(escapeOptions[disableKey], key)) {
      // this info[key] doesnt need to escaped if the option is listed in __dangerouslyDisableSanitizers
      escaped[key] = value;
      continue;
    }

    const tagId = info[tagIDKeyName];

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
      escaped[key] = value.map(v => {
        if (isPureObject(v)) {
          return escape(v, options, { ...escapeOptions,
            escapeKeys: true
          });
        }

        return doEscape(v);
      });
    } else if (isPureObject(value)) {
      escaped[key] = escape(value, options, { ...escapeOptions,
        escapeKeys: true
      });
    } else {
      escaped[key] = value;
    }

    if (escapeKeys) {
      const escapedKey = doEscape(key);

      if (key !== escapedKey) {
        escaped[escapedKey] = escaped[key];
        delete escaped[key];
      }
    }
  }

  return escaped;
}

function arrayMerge({
  component,
  tagIDKeyName,
  metaTemplateKeyName,
  contentKeyName
}, target, source) {
  // we concat the arrays without merging objects contained in,
  // but we check for a `vmid` property on each object in the array
  // using an O(1) lookup associative array exploit
  const destination = [];
  target.forEach((targetItem, targetIndex) => {
    // no tagID so no need to check for duplicity
    if (!targetItem[tagIDKeyName]) {
      destination.push(targetItem);
      return;
    }

    const sourceIndex = findIndex(source, item => item[tagIDKeyName] === targetItem[tagIDKeyName]);
    const sourceItem = source[sourceIndex]; // source doesnt contain any duplicate vmid's, we can keep targetItem

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


    const targetTemplate = targetItem[metaTemplateKeyName];

    if (!targetTemplate) {
      return;
    }

    const sourceTemplate = sourceItem[metaTemplateKeyName];

    if (!sourceTemplate) {
      // use parent template and child content
      applyTemplate({
        component,
        metaTemplateKeyName,
        contentKeyName
      }, sourceItem, targetTemplate);
    } else if (!sourceItem[contentKeyName]) {
      // use child template and parent content
      applyTemplate({
        component,
        metaTemplateKeyName,
        contentKeyName
      }, sourceItem, undefined, targetItem[contentKeyName]);
    }
  });
  return destination.concat(source);
}
function merge(target, source, options = {}) {
  // remove properties explicitly set to false so child components can
  // optionally _not_ overwrite the parents content
  // (for array properties this is checked in arrayMerge)
  if (source.hasOwnProperty('title') && source.title === undefined) {
    delete source.title;
  }

  metaInfoAttributeKeys.forEach(attrKey => {
    if (!source[attrKey]) {
      return;
    }

    for (const key in source[attrKey]) {
      if (source[attrKey].hasOwnProperty(key) && source[attrKey][key] === undefined) {
        if (includes(booleanHtmlAttributes, key)) {
          warn('VueMeta: Please note that since v2 the value undefined is not used to indicate boolean attributes anymore, see migration guide for details');
        }

        delete source[attrKey][key];
      }
    }
  });
  return deepmerge(target, source, {
    arrayMerge: (t, s) => arrayMerge(options, t, s)
  });
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

function getComponentOption(options = {}, component, result = {}) {
  const {
    keyName,
    metaTemplateKeyName,
    tagIDKeyName
  } = options;
  const {
    $options,
    $children
  } = component;

  if (component._inactive) {
    return result;
  } // only collect option data if it exists


  if ($options[keyName]) {
    let data = $options[keyName]; // if option is a function, replace it with it's result

    if (isFunction(data)) {
      data = data.call(component);
    } // ignore data if its not an object, then we keep our previous result


    if (!isObject(data)) {
      return result;
    } // merge with existing options


    result = merge(result, data, options);
  } // collect & aggregate child options if deep = true


  if ($children.length) {
    $children.forEach(childComponent => {
      // check if the childComponent is in a branch
      // return otherwise so we dont walk all component branches unnecessarily
      if (!inMetaInfoBranch(childComponent)) {
        return;
      }

      result = getComponentOption(options, childComponent, result);
    });
  }

  if (metaTemplateKeyName && result.meta) {
    // apply templates if needed
    result.meta.forEach(metaObject => applyTemplate(options, metaObject)); // remove meta items with duplicate vmid's

    result.meta = result.meta.filter((metaItem, index, arr) => {
      return (// keep meta item if it doesnt has a vmid
        !metaItem.hasOwnProperty(tagIDKeyName) || // or if it's the first item in the array with this vmid
        index === findIndex(arr, item => item[tagIDKeyName] === metaItem[tagIDKeyName])
      );
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

function getMetaInfo(options = {}, component, escapeSequences = []) {
  // collect & aggregate all metaInfo $options
  let info = getComponentOption(options, component, defaultInfo); // Remove all "template" tags from meta
  // backup the title chunk in case user wants access to it

  if (info.title) {
    info.titleChunk = info.title;
  } // replace title with populated template


  if (info.titleTemplate && info.titleTemplate !== '%s') {
    applyTemplate({
      component,
      contentKeyName: 'title'
    }, info, info.titleTemplate, info.titleChunk || '');
  } // convert base tag to an array so it can be handled the same way
  // as the other tags


  if (info.base) {
    info.base = Object.keys(info.base).length ? [info.base] : [];
  }

  const escapeOptions = {
    doEscape: value => escapeSequences.reduce((val, [v, r]) => val.replace(v, r), value)
  };
  disableOptionKeys.forEach((disableKey, index) => {
    if (index === 0) {
      ensureIsArray(info, disableKey);
    } else if (index === 1) {
      for (const key in info[disableKey]) {
        ensureIsArray(info[disableKey], key);
      }
    }

    escapeOptions[disableKey] = info[disableKey];
  }); // begin sanitization

  info = escape(info, options, escapeOptions);
  return info;
}

function getTag(tags, tag) {
  if (!tags[tag]) {
    tags[tag] = document.getElementsByTagName(tag)[0];
  }

  return tags[tag];
}
function getElementsKey({
  body,
  pbody
}) {
  return body ? 'body' : pbody ? 'pbody' : 'head';
}
function queryElements(parentNode, {
  appId,
  attribute,
  type,
  tagIDKeyName
}, attributes = {}) {
  const queries = [`${type}[${attribute}="${appId}"]`, `${type}[data-${tagIDKeyName}]`].map(query => {
    for (const key in attributes) {
      const val = attributes[key];
      const attributeValue = val && val !== true ? `="${val}"` : '';
      query += `[data-${key}${attributeValue}]`;
    }

    return query;
  });
  return toArray(parentNode.querySelectorAll(queries.join(', ')));
}

const callbacks = [];
function isDOMComplete(d = document) {
  return d.readyState === 'complete';
}
function addCallback(query, callback) {
  if (arguments.length === 1) {
    callback = query;
    query = '';
  }

  callbacks.push([query, callback]);
}
function addCallbacks({
  tagIDKeyName
}, type, tags, autoAddListeners) {
  let hasAsyncCallback = false;

  for (const tag of tags) {
    if (!tag[tagIDKeyName] || !tag.callback) {
      continue;
    }

    hasAsyncCallback = true;
    addCallback(`${type}[data-${tagIDKeyName}="${tag[tagIDKeyName]}"]`, tag.callback);
  }

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


  document.onreadystatechange = () => {
    applyCallbacks();
  };
}
function applyCallbacks(matchElement) {
  for (const [query, callback] of callbacks) {
    const selector = `${query}[onload="this.__vm_l=1"]`;
    let elements = [];

    if (!matchElement) {
      elements = toArray(document.querySelectorAll(selector));
    }

    if (matchElement && matchElement.matches(selector)) {
      elements = [matchElement];
    }

    for (const element of elements) {
      /* __vm_cb: whether the load callback has been called
       * __vm_l: set by onload attribute, whether the element was loaded
       * __vm_ev: whether the event listener was added or not
       */
      if (element.__vm_cb) {
        continue;
      }

      const onload = () => {
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
        continue;
      }

      if (!element.__vm_ev) {
        element.__vm_ev = true;
        element.addEventListener('load', onload);
      }
    }
  }
}

/**
 * Updates the document's html tag attributes
 *
 * @param  {Object} attrs - the new document html attributes
 * @param  {HTMLElement} tag - the HTMLElement tag to update with new attrs
 */

function updateAttribute({
  attribute
} = {}, attrs, tag) {
  const vueMetaAttrString = tag.getAttribute(attribute);
  const vueMetaAttrs = vueMetaAttrString ? vueMetaAttrString.split(',') : [];
  const toRemove = toArray(vueMetaAttrs);
  const keepIndexes = [];

  for (const attr in attrs) {
    if (attrs.hasOwnProperty(attr)) {
      const value = includes(booleanHtmlAttributes, attr) ? '' : isArray(attrs[attr]) ? attrs[attr].join(' ') : attrs[attr];
      tag.setAttribute(attr, value || '');

      if (!includes(vueMetaAttrs, attr)) {
        vueMetaAttrs.push(attr);
      } // filter below wont ever check -1


      keepIndexes.push(toRemove.indexOf(attr));
    }
  }

  const removedAttributesCount = toRemove.filter((el, index) => !includes(keepIndexes, index)).reduce((acc, attr) => {
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

function updateTag(appId, options = {}, type, tags, head, body) {
  const {
    attribute,
    tagIDKeyName
  } = options;
  const dataAttributes = [tagIDKeyName, ...commonDataAttributes];
  const newElements = [];
  const queryOptions = {
    appId,
    attribute,
    type,
    tagIDKeyName
  };
  const currentElements = {
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
    const found = [];
    tags = tags.filter(x => {
      const k = JSON.stringify(x);
      const res = !includes(found, k);
      found.push(k);
      return res;
    });
  }

  if (tags.length) {
    for (const tag of tags) {
      if (tag.skip) {
        continue;
      }

      const newElement = document.createElement(type);
      newElement.setAttribute(attribute, appId);

      for (const attr in tag) {
        /* istanbul ignore next */
        if (!tag.hasOwnProperty(attr)) {
          continue;
        }

        if (attr === 'innerHTML') {
          newElement.innerHTML = tag.innerHTML;
          continue;
        }

        if (attr === 'json') {
          newElement.innerHTML = JSON.stringify(tag.json);
          continue;
        }

        if (attr === 'cssText') {
          if (newElement.styleSheet) {
            /* istanbul ignore next */
            newElement.styleSheet.cssText = tag.cssText;
          } else {
            newElement.appendChild(document.createTextNode(tag.cssText));
          }

          continue;
        }

        if (attr === 'callback') {
          newElement.onload = () => tag[attr](newElement);

          continue;
        }

        const _attr = includes(dataAttributes, attr) ? `data-${attr}` : attr;

        const isBooleanAttribute = includes(booleanHtmlAttributes, attr);

        if (isBooleanAttribute && !tag[attr]) {
          continue;
        }

        const value = isBooleanAttribute ? '' : tag[attr];
        newElement.setAttribute(_attr, value);
      }

      const oldElements = currentElements[getElementsKey(tag)]; // Remove a duplicate tag from domTagstoRemove, so it isn't cleared.

      let indexToDelete;
      const hasEqualElement = oldElements.some((existingTag, index) => {
        indexToDelete = index;
        return newElement.isEqualNode(existingTag);
      });

      if (hasEqualElement && (indexToDelete || indexToDelete === 0)) {
        oldElements.splice(indexToDelete, 1);
      } else {
        newElements.push(newElement);
      }
    }
  }

  let oldElements = [];

  for (const current of Object.values(currentElements)) {
    oldElements = [...oldElements, ...current];
  } // remove old elements


  for (const element of oldElements) {
    element.parentNode.removeChild(element);
  } // insert new elements


  for (const element of newElements) {
    if (element.hasAttribute('data-body')) {
      body.appendChild(element);
      continue;
    }

    if (element.hasAttribute('data-pbody')) {
      body.insertBefore(element, body.firstChild);
      continue;
    }

    head.appendChild(element);
  }

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

function updateClientMetaInfo(appId, options = {}, newInfo) {
  const {
    ssrAttribute,
    ssrAppId
  } = options; // only cache tags for current update

  const tags = {};
  const htmlTag = getTag(tags, 'html'); // if this is a server render, then dont update

  if (appId === ssrAppId && htmlTag.hasAttribute(ssrAttribute)) {
    // remove the server render attribute so we can update on (next) changes
    htmlTag.removeAttribute(ssrAttribute); // add load callbacks if the

    let addLoadListeners = false;

    for (const type of tagsSupportingOnload) {
      if (newInfo[type] && addCallbacks(options, type, newInfo[type])) {
        addLoadListeners = true;
      }
    }

    if (addLoadListeners) {
      addListeners();
    }

    return false;
  } // initialize tracked changes


  const addedTags = {};
  const removedTags = {};

  for (const type in newInfo) {
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
      const tagName = type.substr(0, 4);
      updateAttribute(options, newInfo[type], getTag(tags, tagName));
      continue;
    } // tags should always be an array, ignore if it isnt


    if (!isArray(newInfo[type])) {
      continue;
    }

    const {
      oldTags,
      newTags
    } = updateTag(appId, options, type, newInfo[type], getTag(tags, 'head'), getTag(tags, 'body'));

    if (newTags.length) {
      addedTags[type] = newTags;
      removedTags[type] = oldTags;
    }
  }

  return {
    addedTags,
    removedTags
  };
}

function _refresh(options = {}) {
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
    const metaInfo = getMetaInfo(options, this.$root, clientSequences);
    const appId = this.$root._vueMeta.appId;
    const tags = updateClientMetaInfo(appId, options, metaInfo); // emit "event" with new info

    if (tags && isFunction(metaInfo.changed)) {
      metaInfo.changed(metaInfo, tags.addedTags, tags.removedTags);
    }

    return {
      vm: this,
      metaInfo,
      tags
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

function attributeGenerator({
  attribute,
  ssrAttribute
} = {}, type, data) {
  return {
    text(addSrrAttribute) {
      let attributeStr = '';
      const watchedAttrs = [];

      for (const attr in data) {
        if (data.hasOwnProperty(attr)) {
          watchedAttrs.push(attr);
          attributeStr += isUndefined(data[attr]) || booleanHtmlAttributes.includes(attr) ? attr : `${attr}="${isArray(data[attr]) ? data[attr].join(' ') : data[attr]}"`;
          attributeStr += ' ';
        }
      }

      if (attributeStr) {
        attributeStr += `${attribute}="${watchedAttrs.sort().join(',')}"`;
      }

      if (type === 'htmlAttrs' && addSrrAttribute) {
        return `${ssrAttribute}${attributeStr ? ' ' : ''}${attributeStr}`;
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
function titleGenerator({
  attribute
} = {}, type, data) {
  return {
    text() {
      if (!data) {
        return '';
      }

      return `<${type}>${data}</${type}>`;
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

function tagGenerator({
  ssrAppId,
  attribute,
  tagIDKeyName
} = {}, type, tags) {
  const dataAttributes = [tagIDKeyName, 'callback', ...commonDataAttributes];
  return {
    text({
      body = false,
      pbody = false
    } = {}) {
      // build a string containing all tags of this type
      return tags.reduce((tagsStr, tag) => {
        if (tag.skip) {
          return tagsStr;
        }

        const tagKeys = Object.keys(tag);

        if (tagKeys.length === 0) {
          return tagsStr; // Bail on empty tag object
        }

        if (Boolean(tag.body) !== body || Boolean(tag.pbody) !== pbody) {
          return tagsStr;
        }

        let attrs = tag.once ? '' : ` ${attribute}="${ssrAppId}"`; // build a string containing all attributes of this tag

        for (const attr in tag) {
          // these attributes are treated as children on the tag
          if (tagAttributeAsInnerContent.includes(attr) || attr === 'once') {
            continue;
          } // these form the attribute list for this tag


          let prefix = '';

          if (dataAttributes.includes(attr)) {
            prefix = 'data-';
          }

          if (attr === 'callback') {
            attrs += ` onload="this.__vm_l=1"`;
            continue;
          }

          const isBooleanAttr = !prefix && booleanHtmlAttributes.includes(attr);

          if (isBooleanAttr && !tag[attr]) {
            continue;
          }

          attrs += ` ${prefix}${attr}` + (isBooleanAttr ? '' : `="${tag[attr]}"`);
        }

        let json = '';

        if (tag.json) {
          json = JSON.stringify(tag.json);
        } // grab child content from one of these attributes, if possible


        const content = tag.innerHTML || tag.cssText || json; // generate tag exactly without any other redundant attribute
        // these tags have no end tag

        const hasEndTag = !tagsWithoutEndTag.includes(type); // these tag types will have content inserted

        const hasContent = hasEndTag && tagsWithInnerContent.includes(type); // the final string for this specific tag

        return `${tagsStr}<${type}${attrs}${!hasContent && hasEndTag ? '/' : ''}>` + (hasContent ? `${content}</${type}>` : '');
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

function generateServerInjector(options, type, data) {
  if (type === 'title') {
    return titleGenerator(options, type, data);
  }

  if (metaInfoAttributeKeys.includes(type)) {
    return attributeGenerator(options, type, data);
  }

  return tagGenerator(options, type, data);
}

function _inject(options = {}) {
  /**
   * Converts the state of the meta info object such that each item
   * can be compiled to a tag string on the server
   *
   * @this {Object} - Vue instance - ideally the root component
   * @return {Object} - server meta info with `toString` methods
   */
  return function inject() {
    // get meta info with sensible defaults
    const metaInfo = getMetaInfo(options, this.$root, serverSequences); // generate server injectors

    for (const key in metaInfo) {
      if (!metaInfoOptionKeys.includes(key) && metaInfo.hasOwnProperty(key)) {
        metaInfo[key] = generateServerInjector(options, key, metaInfo[key]);
      }
    }

    return metaInfo;
  };
}

function _$meta(options = {}) {
  const _refresh$1 = _refresh(options);

  const _inject$1 = _inject(options);
  /**
   * Returns an injector for server-side rendering.
   * @this {Object} - the Vue instance (a root component)
   * @return {Object} - injector
   */


  return function $meta() {
    return {
      getOptions: () => getOptions(options),
      refresh: _refresh$1.bind(this),
      inject: _inject$1.bind(this),
      pause: pause.bind(this),
      resume: resume.bind(this)
    };
  };
}

/**
 * Plugin install function.
 * @param {Function} Vue - the Vue constructor.
 */

function install(Vue, options = {}) {
  if (Vue.__vuemeta_installed) {
    return;
  }

  Vue.__vuemeta_installed = true;
  options = setOptions(options);
  Vue.prototype.$meta = _$meta(options);
  Vue.mixin(createMixin(Vue, options));
}

var index = {
  version,
  install,
  hasMetaInfo
};

module.exports = index;
