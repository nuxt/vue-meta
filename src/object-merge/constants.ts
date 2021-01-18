// https://github.com/microsoft/TypeScript/issues/1863
export const IS_PROXY = Symbol('kIsProxy') as unknown as string
export const PROXY_SOURCES = Symbol('kProxySources') as unknown as string
export const PROXY_TARGET = Symbol('kProxyTarget') as unknown as string
export const RESOLVE_CONTEXT = Symbol('kResolveContext') as unknown as string
