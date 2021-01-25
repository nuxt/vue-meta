import type { App, VNode, ComponentInternalInstance } from 'vue';
import type { MergedObject, ResolveContext, ResolveMethod } from '../object-merge';
export declare type TODO = any;
export declare type MetainfoInput = {
    [key: string]: TODO;
};
export declare type MetaContext = ResolveContext & {
    vm: ComponentInternalInstance | undefined;
};
export interface ConfigOption {
    tag?: string;
    to?: string;
    group?: boolean;
    keyAttribute?: string;
    valueAttribute?: string;
    nameless?: boolean;
    namespaced?: boolean;
    namespacedAttribute?: boolean;
    attributesFor?: string;
}
export interface Config {
    [key: string]: ConfigOption;
}
export interface MetainfoProxy extends MergedObject {
}
export interface MetainfoActive {
    [key: string]: TODO;
}
export declare type MetaProxy = {
    meta: MetainfoProxy;
    unmount: TODO;
};
export declare type ResolveSetup = (context: MetaContext) => void;
export declare type Resolver = {
    setup?: ResolveSetup;
    resolve: ResolveMethod;
};
export declare type Manager = {
    readonly config: Config;
    install(app: App): void;
    addMeta(obj: MetainfoInput, vm?: ComponentInternalInstance): MetaProxy;
    render(ctx: {
        slots?: any;
    }): Array<VNode>;
};
declare module '@vue/runtime-core' {
    interface ComponentInternalInstance {
        $metaManager: Manager;
    }
}
declare global {
    namespace NodeJS {
        interface Process {
            client: boolean;
            server: boolean;
        }
    }
}
//# sourceMappingURL=index.d.ts.map