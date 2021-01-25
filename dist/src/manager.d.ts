import { VNode } from 'vue';
import type { ResolveMethod } from './object-merge';
import type { Manager, Config, Resolver, MetainfoActive } from './types';
export declare const ssrAttribute = "data-vm-ssr";
export declare const active: MetainfoActive;
export declare function addVnode(teleports: any, to: string, _vnodes: VNode | Array<VNode>): void;
export declare function createMetaManager(config: Config, resolver: Resolver | ResolveMethod): Manager;
//# sourceMappingURL=manager.d.ts.map