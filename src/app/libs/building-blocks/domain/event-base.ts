import { UnknownAny } from '@shared-kernel/types';
import { NotAllowedInPropsCheck } from './event-creator-type-errors';
import { Uuid } from './value-objects/uuid.value-object';

export abstract class BaseEvent<Name extends string = string> {
  static readonly type: string;

  readonly id = Uuid.generate().toPrimitives();
  readonly occurredOn = new Date();

  constructor(public readonly type: Name) {}
}

export declare type Creator<
  P = UnknownAny,
  R extends Record<UnknownAny, unknown> = Record<UnknownAny, UnknownAny>
> = {
  new (props: P): R;
  create(props: P): R;
  readonly type: string;
};

export declare type EventCreator<
  T extends string = string,
  C extends Creator = Creator
> = C & {
  type: T;
};

export interface EventCreatorProps<T> {
  _as: 'props';
  _p: T;
}

export function props<
  P extends SafeProps | void,
  SafeProps = NotAllowedInPropsCheck<P>
>(): EventCreatorProps<P> {
  return { _as: 'props', _p: undefined as any };
}
