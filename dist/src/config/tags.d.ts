export interface TagConfig {
    keyAttribute?: string;
    contentAsAttribute?: boolean | string;
    attributes: boolean | Array<string>;
    [key: string]: any;
}
declare const tags: {
    [key: string]: TagConfig;
};
export { tags };
//# sourceMappingURL=tags.d.ts.map