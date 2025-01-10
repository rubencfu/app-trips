import { UnknownAny } from '@shared-kernel/types';

const arraysAreNotAllowedMsg = 'action creator cannot return an array';
type ArraysAreNotAllowed = typeof arraysAreNotAllowedMsg;

const typePropertyIsNotAllowedMsg =
  'action creator cannot return an object with property named `type`';
type TypePropertyIsNotAllowed = typeof typePropertyIsNotAllowedMsg;

const ocurredOnPropertyIsNotAllowedMsg =
  'action creator cannot return an object with a property name `ocurredOn`';
type OccurredOnPropertyIsNotAllowed = typeof ocurredOnPropertyIsNotAllowedMsg;

const aggregateIdPropertyIsNotAllowedMsg =
  'action creator cannot return an object with a property name `aggregateId`';
type AggregateIdPropertyIsNotAllowed =
  typeof aggregateIdPropertyIsNotAllowedMsg;

const aggregateNamePropertyIsNotAllowedMsg =
  'action creator cannot return an object with a property name `aggregateName`';
type AggregateNamePropertyIsNotAllowed =
  typeof aggregateNamePropertyIsNotAllowedMsg;

const emptyObjectsAreNotAllowedMsg =
  'action creator cannot return an empty object';
type EmptyObjectsAreNotAllowed = typeof emptyObjectsAreNotAllowedMsg;

const arrayAreNotAllowedInProps = 'action creator props cannot be an array';
type ArraysAreNotAllowedInProps = typeof arrayAreNotAllowedInProps;

const typePropertyIsNotAllowedInProps =
  'action creator props cannot have a property named `type`';
type TypePropertyIsNotAllowedInProps = typeof typePropertyIsNotAllowedInProps;

const emptyObjectsAreNotAllowedInProps =
  'action creator props cannot be an empty object';
type EmptyObjectsAreNotAllowedInProps = typeof emptyObjectsAreNotAllowedInProps;

const primitivesAreNotAllowedInProps =
  'action creator props cannot be a primitive value';
type PrimitivesAreNotAllowedInProps = typeof primitivesAreNotAllowedInProps;

export type Primitive =
  | string
  | number
  | bigint
  | boolean
  | symbol
  | null
  | undefined;

export type NotAllowedCheck<T extends Record<UnknownAny, unknown>> =
  T extends unknown[]
    ? ArraysAreNotAllowed
    : T extends { type: unknown }
    ? TypePropertyIsNotAllowed
    : keyof T extends never
    ? EmptyObjectsAreNotAllowed
    : unknown;

export type NotAllowedInPropsCheck<T> = T extends object
  ? T extends unknown[]
    ? ArraysAreNotAllowedInProps
    : T extends { type: unknown }
    ? TypePropertyIsNotAllowedInProps
    : T extends { ocurredOn: unknown }
    ? OccurredOnPropertyIsNotAllowed
    : T extends { aggregateId: unknown }
    ? AggregateIdPropertyIsNotAllowed
    : T extends { aggregateName: unknown }
    ? AggregateNamePropertyIsNotAllowed
    : keyof T extends never
    ? EmptyObjectsAreNotAllowedInProps
    : unknown
  : T extends Primitive
  ? PrimitivesAreNotAllowedInProps
  : never;
