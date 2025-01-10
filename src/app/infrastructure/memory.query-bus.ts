import { Injectable } from '@angular/core';

import { Query, QueryBus, QueryHandler } from '@building-blocks/domain';
import { ConcreteType } from '@shared-kernel/types';

// I implement the QueryBus using memory (Map)
@Injectable()
export class MemoryQueryBus extends QueryBus {
  private bindings = new Map<string, QueryHandler<Query>>();

  register(query: ConcreteType<Query>, handler: QueryHandler<Query>): void {
    const queryType = (query as unknown as Query).type;

    if (this.bindings.has(queryType)) {
      throw new Error('You have tried to register a query that already has been registered');
    }

    this.bindings.set(queryType, handler);
  }

  async execute<Out>(query: Query<string, unknown, Out>): Promise<Out> {
    const handler = this.bindings.get(query.type);

    if (!handler) {
      throw new Error('this query does not have a handler registered');
    }

    return handler.handle(query) as Out;
  }
}
