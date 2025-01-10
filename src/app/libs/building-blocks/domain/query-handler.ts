import { Type, UnknownAny } from '@shared-kernel/types';
import { assertUnreachable } from '@shared-kernel/utils/assertion';

import { GetOutput, Query, QueryCreator } from './query';
import { Handler } from '.';

export abstract class QueryHandler<Q extends Query> extends Handler<
  Q,
  Promise<GetOutput<Q>> | GetOutput<Q>
> {}

const QUERY_HANDLED_SYMBOL = Symbol('Store Query class handled');

export function createQueryHandler<Q extends Query>(
  query: Type<Q>
): (abstract new () => QueryHandler<Q>) & {
  [QUERY_HANDLED_SYMBOL]: typeof query;
} {
  abstract class DecoratedQueryHandler extends QueryHandler<Q> {
    static [QUERY_HANDLED_SYMBOL] = query;
  }
  return DecoratedQueryHandler;
}

export function GetQueryHandlerOf(
  handler: Type<QueryHandler<Query>> | QueryHandler<Query>
): QueryCreator {
  if (typeof handler === 'function') {
    return (handler as UnknownAny)[QUERY_HANDLED_SYMBOL];
  }

  if (handler != null && typeof handler === 'object') {
    return (handler.constructor as UnknownAny)[QUERY_HANDLED_SYMBOL];
  }

  assertUnreachable(handler as never);
}
