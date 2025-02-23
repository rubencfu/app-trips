import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';

import { QueryBus } from '@building-blocks/domain';
import { Nullish } from '@shared-kernel/types';

import { AppStore } from '@shared/state/app.store';

import { NonEmptyString, PositiveNumber, TripFiltersVO } from '@domain/value-objects';
import { getTripScore } from '@domain/functions';
import { GetTripsQuery } from '@domain/queries';
import { FrontendTrip } from '@domain/models';

// This will act as a view model of the page
export interface HomePageState {
  state: 'loading' | 'idle';
  page: number;
  totalItems: number;
  maxPages: number;
  trips: FrontendTrip[];
}

const initialState: HomePageState = {
  state: 'idle',
  page: 1,
  totalItems: 0,
  trips: [],
  maxPages: 1,
};

export const HomePageStore = signalStore(
  withState(initialState),
  // On init, we sync with the app store the page filter (if there is saved state from previous navigation)
  withHooks({
    onInit(store, appStore = inject(AppStore)) {
      patchState(store, { page: appStore.filters().page });
    },
  }),
  withMethods((store, queryBus = inject(QueryBus), appStore = inject(AppStore)) => ({
    setPage(page: number) {
      patchState(store, { page });
    },

    // This is called when the page first loads, or when a filter/page changes (it is called on the component)
    getTrips(params: {
      hooks: {
        onSuccess?: () => void;
        onError: (error: Error) => void;
      };
    }) {
      patchState(store, { state: 'loading' });

      // We get the filters from the app store
      const filters = appStore.filters();

      const filtersVO = new TripFiltersVO({
        limit: getPositiveNumberValueObject(Number(filters.limit)),
        page: getPositiveNumberValueObject(Number(filters.page)),
        maxPrice: getPositiveNumberValueObject(Number(filters.maxPrice)),
        minPrice: getPositiveNumberValueObject(Number(filters.minPrice)),
        minRating: getPositiveNumberValueObject(Number(filters.minRating)),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        titleFilter: getNonEmptyStringValueObject(filters.titleFilter),
        tags: getNonEmptyStringValueObject(filters.tags),
      });

      queryBus
        .execute(
          new GetTripsQuery({
            filters: filtersVO,
          })
        )
        .then(({ items, total }) => {
          patchState(store, {
            totalItems: total,
            maxPages: Math.ceil(total / (filters.limit as number)),
            trips: items.map((trip) => ({ ...trip, score: getTripScore(trip) })),
          });
        })
        .catch((error: Error) => params.hooks.onError(error))
        .finally(() => patchState(store, { state: 'idle' }));
    },
  }))
);

function getPositiveNumberValueObject(value: Nullish<number>) {
  return value ? new PositiveNumber({ value }) : undefined;
}

function getNonEmptyStringValueObject(value: Nullish<string>) {
  return value ? new NonEmptyString({ value }) : undefined;
}
