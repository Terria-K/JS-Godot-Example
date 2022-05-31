export interface AllowUnsafe {
    unsafe: boolean;
    makeSafe(): void;
}

export function Unsafe<T extends AllowUnsafe>(unsafeBlock: (unsafe: T) => void, unsafeDependencies: T): T {
    unsafeDependencies.unsafe = true;
    unsafeBlock(unsafeDependencies);
    unsafeDependencies.unsafe = false;
    return unsafeDependencies;
}