interface DebugInterface {
    (...args: any[]): void;
    warn: Function;
    error: Function;
}
export declare const debugFn: (logFn: Function, setChildFns?: boolean) => {
    (...args: any[]): void;
    warn: any;
    error: any;
};
export declare const debug: DebugInterface;
export {};
//# sourceMappingURL=debug.d.ts.map