import { VNodeProps } from 'vue';
import { MetainfoActive } from './types';
export interface MetainfoProps {
    metainfo: MetainfoActive;
}
export declare const MetainfoImpl: import("vue").DefineComponent<{}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>[] | undefined, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, import("vue").EmitsOptions, string, VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{} & {}>, {}>;
export declare const Metainfo: new () => {
    $props: VNodeProps & MetainfoProps;
};
//# sourceMappingURL=Metainfo.d.ts.map