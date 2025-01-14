import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';

import { QueryBus } from '@building-blocks/domain';

import { getTripScore } from '@domain/functions';
import { GetTripQuery } from '@domain/queries';
import { FrontendTrip } from '@domain/models';

export interface TripDetailsPageState {
  state: 'loading' | 'idle';
  trip: FrontendTrip;
}

const initialState: TripDetailsPageState = {
  state: 'idle',
  trip: {} as FrontendTrip,
};

export const TripDetailsPageStore = signalStore(
  withState(initialState),
  withMethods((store, queryBus = inject(QueryBus)) => ({
    getTrip(params: {
      tripId: string;
      hooks: {
        onSuccess?: () => void;
        onError: (error: Error) => void;
      };
    }) {
      patchState(store, { state: 'loading' });

      queryBus
        .execute(new GetTripQuery({ tripId: params.tripId }))
        .then(({ trip }) => {
          patchState(store, { trip: { ...trip, score: getTripScore(trip) } });
        })
        .catch((error: Error) => params.hooks.onError(error))
        .finally(() => patchState(store, { state: 'idle' }));
    },
  }))
);
