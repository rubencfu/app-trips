import { Inject, InjectionToken, ModuleWithProviders, NgModule, Provider } from '@angular/core';

import { GetQueryHandlerOf, Query, QueryBus, QueryHandler } from '@building-blocks/domain';
import { ConcreteType } from '@shared-kernel/types';

import { MemoryQueryBus } from './memory.query-bus';

export function registerQueryHandlers(
  handlerTypes: ConcreteType<QueryHandler<Query>>[]
): Provider[] {
  return [
    handlerTypes,
    MemoryQueryBus,
    {
      provide: QueryBus,
      useFactory: (queryBus: MemoryQueryBus, ...handlers: QueryHandler<Query>[]) => {
        for (const handler of handlers) {
          queryBus.register(GetQueryHandlerOf(handler), handler);
        }
        return queryBus;
      },
      deps: [MemoryQueryBus, ...handlerTypes],
    },
  ];
}
