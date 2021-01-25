import { ResolveMethod } from '../object-merge';
import { MetaContext } from '../types';
declare type MergeContextDeepest = MetaContext & {
    depth: number;
};
export declare function setup(context: MergeContextDeepest): void;
export declare const resolve: ResolveMethod;
export {};
//# sourceMappingURL=deepest.d.ts.map