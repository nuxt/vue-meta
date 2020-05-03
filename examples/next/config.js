const defaults = {
  title: {
    contentAttributes: false
  },
  base: {
    contentAttributes: [
      'href',
      'target'
    ]
  },
  meta: {
    nameAttribute: 'name',
    contentAttributes: [
      'content',
      'name',
      'http-equiv',
      'charset'
    ]
  },
  link: {
    contentAttributes: [
      'href',
      'crossorigin',
      'rel',
      'media',
      'integrity',
      'hreflang',
      'type',
      'referrerpolicy',
      'sizes',
      'imagesrcset',
      'imagesizes',
      'as',
      'color'
    ]
  },
  style: {
    contentAttributes: [
      'media'
    ]
  },
  script: {
    contentAttributes: [
      'src',
      'type',
      'nomodule',
      'async',
      'defer',
      'crossorigin',
      'integrity',
      'referrerpolicy'
    ]
  },
  noscript: {
    contentAttributes: false
  }
}

const defaultMapping = {
  body: {
    tag: 'script',
    target: 'body'
  },
  base: {
    contentAttribute: 'href'
  },
  charset: {
    tag: 'meta',
    nameless: true,
    contentAttribute: 'charset'
  },
  description: {
    tag: 'meta'
  },
  og: {
    group: true,
    namespacedAttribute: true,
    tag: 'meta',
    nameAttribute: 'property'
  },
  twitter: {
    group: true,
    namespacedAttribute: true,
    tag: 'meta'
  }
}

export {
  defaults,
  defaultMapping
}

export function hasConfig (name) {
  return !!defaults[name] || !!defaultMapping[name]
}

export function getConfigKey (name, key, config, dontLog) {
  if (!dontLog) {
    // console.log('getConfigKey', name, key, getConfigKey(name, key, config, true), config)
  }

  if (config && key in config) {
    return config[key]
  }

  if (Array.isArray(name)) {
    for (const _name of name) {
      if (_name && _name in defaults) {
        return defaults[_name][key]
      }
    }
  }

  if (name in defaults) {
    return defaults[name][key]
  }

  return undefined
}
