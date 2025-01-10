import { UnknownAny } from '@shared-kernel/types';
import { BaseEvent, EventCreator, EventCreatorProps } from './event-base';
import { NotAllowedCheck } from './event-creator-type-errors';

const META_QUERY_OUT_INFORMATION_SYMBOL = Symbol(
  'This symbol is used only to retain typescript typing information'
);

const META_QUERY_IN_INFORMATION_SYMBOL = Symbol(
  'This symbol is used only to retain typescript typing information'
);

export abstract class Query<
  Name extends string = string,
  In = unknown,
  Out = unknown
> extends BaseEvent<Name> {
  declare [META_QUERY_IN_INFORMATION_SYMBOL]: In;
  declare [META_QUERY_OUT_INFORMATION_SYMBOL]: Out;
}

export type QueryCreator<Name extends string = string, In = unknown, Out = unknown> = {
  new (...args: unknown[]): Query<Name, In, Out>;
  create(...args: unknown[]): Query<Name, In, Out>;
  readonly type: Name;
};

export type GetOutput<Q> = Q extends Query<string, unknown, infer Out> ? Out : never;
export type GetQueryInput<Q> = Q extends Query<string, infer In, unknown> ? In : never;

export function createQuery<Name extends string, Out>(config: {
  name: Name;
  in: EventCreatorProps<void>;
  out: EventCreatorProps<Out>;
}): EventCreator<
  Name,
  {
    new (): Query<Name, void, Out>;
    create(): Query<Name, void, Out>;
    readonly type: string;
  }
>;

export function createQuery<
  Name extends string,
  In extends Record<UnknownAny, unknown>,
  Out
>(config: {
  name: Name;
  in: EventCreatorProps<In> & NotAllowedCheck<In>;
  out: EventCreatorProps<Out>;
}): EventCreator<
  Name,
  {
    new (props: In & NotAllowedCheck<In>): Query<Name, In, Out> & In;
    create(props: In & NotAllowedCheck<In>): Query<Name, In, Out> & In;
    readonly type: string;
  }
>;
export function createQuery<Name extends string, Out>(config: {
  name: Name;
  out: EventCreatorProps<Out>;
}): EventCreator<
  Name,
  {
    new (): Query<Name, unknown, Out>;
    create(): Query<Name, unknown, Out>;
    readonly type: string;
  }
>;

export function createQuery<Type extends string>(config: {
  name: Type;
}): new (props?: UnknownAny) => Query<string> {
  return class extends Query {
    static override readonly type = config.name;

    constructor(props: Record<UnknownAny, unknown>) {
      super(config.name);
      Object.assign(this, props);
      Object.freeze(this);
    }

    static create(props: Record<UnknownAny, unknown>) {
      return new this(props);
    }
  };
}

export function out<P>(): EventCreatorProps<P> {
  return { _as: 'props', _p: undefined as UnknownAny };
}
