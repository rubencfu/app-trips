export interface Serializable<Out> {
  toPrimitives(): Out;
}

export type GetPrimitive<S extends Serializable<unknown>> =
  S extends Serializable<infer Out> ? Out : never;

export type MapSerializablesToPrimitives<
  Serializables extends Record<string, unknown>
> = {
  [k in keyof Serializables]: Serializables[k] extends Serializable<infer Out>
    ? Out
    : Serializables[k];
};

export function isSerializable(vo: unknown): vo is Serializable<unknown> {
  return (
    !!vo &&
    typeof vo === 'object' &&
    typeof (vo as Serializable<unknown>).toPrimitives === 'function'
  );
}
