import type { MergeContext, MergeSource, MergedObject, PathSegments } from '.';
export declare const allKeys: (source?: MergeSource | undefined, ...sources: Array<MergeSource>) => Array<string>;
export declare const recompute: (context: MergeContext, sources?: MergeSource[] | undefined, target?: MergedObject | undefined, path?: PathSegments) => void;
//# sourceMappingURL=recompute.d.ts.map