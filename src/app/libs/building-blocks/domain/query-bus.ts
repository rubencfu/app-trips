import { Type } from '@shared-kernel/types';
import { Query } from './query';
import { QueryHandler } from './query-handler';

export abstract class QueryBus {
  abstract execute<In, Out>(query: Query<string, In, Out>): Promise<Out>;
  abstract register(query: Type<Query>, handler: QueryHandler<Query>): void;
}
