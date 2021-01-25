export declare type MergeSource = {
    [key: string]: any;
};
export declare type MergedObjectValue = boolean | number | string | MergedObject | any;
export declare type MergedObject = {
    [key: string]: MergedObjectValue;
};
export declare type PathSegments = Array<string>;
export declare type ResolveContext = {};
export declare type ResolveMethod = (options: Array<any>, contexts: Array<ResolveContext>, active: MergedObjectValue, key: string | number | symbol, pathSegments: PathSegments) => MergedObjectValue;
export declare type MergeContext = {
    resolve: ResolveMethod;
    active: MergedObject;
    sources: Array<MergeSource>;
};
export declare const createMergedObject: (resolve: ResolveMethod, active?: MergedObject) => {
    context: MergeContext;
    active: MergedObject;
    resolve: ResolveMethod;
    sources: MergeSource[];
    addSource: (source: MergeSource, resolveContext: ResolveContext | undefined, recompute?: Boolean) => any;
    delSource: (sourceOrProxy: MergeSource, recompute?: boolean) => boolean;
    compute: () => void;
};
//# sourceMappingURL=index.d.ts.map