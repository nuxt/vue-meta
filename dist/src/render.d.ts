import { VNode } from 'vue';
import { TODO } from './types';
export interface RenderContext {
    slots: any;
    [key: string]: TODO;
}
export interface GroupConfig {
    group: string;
    data: Array<TODO> | TODO;
    tagNamespace?: string;
    fullName?: string;
    slotName?: string;
}
export interface SlotScopeProperties {
    content: any;
    metainfo: any;
    [key: string]: any;
}
export declare type RenderedMetainfoNode = {
    vnode: VNode;
    to?: string;
};
export declare type RenderedMetainfo = Array<RenderedMetainfoNode>;
export declare function renderMeta(context: RenderContext, key: string, data: TODO, config: TODO): void | RenderedMetainfo | RenderedMetainfoNode;
export declare function renderGroup(context: RenderContext, key: string, data: TODO, config: TODO): RenderedMetainfo | RenderedMetainfoNode;
export declare function renderTag(context: RenderContext, key: string, data: TODO, config?: TODO, groupConfig?: GroupConfig): RenderedMetainfo | RenderedMetainfoNode;
export declare function renderAttributes(context: RenderContext, key: string, data: TODO, config?: TODO): RenderedMetainfoNode | void;
export declare function getSlotContent({ metainfo, slots }: RenderContext, slotName: string, content: any, groupConfig?: GroupConfig): TODO;
//# sourceMappingURL=render.d.ts.map