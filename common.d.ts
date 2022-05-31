declare type Action<T> = (item: T) => void;
declare type Func<TResult, T> = (item: T) => TResult;