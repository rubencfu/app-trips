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

const QUERY_HANDLERS = new InjectionToken('Query Handlers to register');

@NgModule()
export class CqrsModule {
  static forRoot() {
    return this.registerQueryHandlers();
  }

  static registerQueryHandlers(
    handlerTypes: ConcreteType<QueryHandler<Query>>[] = []
  ): ModuleWithProviders<CqrsModule> {
    return {
      ngModule: CqrsModule,
      providers: [
        {
          provide: QueryBus,
          useClass: MemoryQueryBus,
        },
        handlerTypes,
        {
          provide: QUERY_HANDLERS,
          useFactory: (...handlers: QueryHandler<Query>[]) => handlers,
          deps: handlerTypes,
        },
      ],
    };
  }

  constructor(queryBus: QueryBus, @Inject(QUERY_HANDLERS) handlers: QueryHandler<Query>[]) {
    for (const handler of handlers) {
      queryBus.register(GetQueryHandlerOf(handler), handler);
    }
  }
}
