export type JsonValues = string | number | boolean | null | JsonValues[] | Json;
export type Json = { [key: string]: JsonValues };

export type UnknownAny = any;
export type Nullish<T> = T | undefined;
export type AbstractType<T = unknown> = (abstract new (...args: any[]) => T) & Function;
export type ConcreteType<T = unknown> = (new (...args: any[]) => T) & Function;
export type Type<T = unknown> = AbstractType<T> | ConcreteType<T>;
