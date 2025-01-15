import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { PLATFORM_ID, inject } from '@angular/core';

import { QueryBus } from '@building-blocks/domain';

import { LocalStorageService } from '@shared/services/localstorage.service';

import { GetTripOfTheDayQuery } from '@domain/queries';
import { getTripScore } from '@domain/functions';
import { FrontendTrip } from '@domain/models';
import { isPlatformServer } from '@angular/common';

export interface TripOfTheDayState {
  state: 'loading' | 'idle';
  tripOfTheDay: FrontendTrip | null; // Trip is undefined until button is clicked or existing trip is recovered
  expiresIn: Date | null; // When trip exists, there is the date when is no longer valid
}

const initialState: TripOfTheDayState = {
  state: 'loading', // Initial state is loading until we check if trip of the day exists
  expiresIn: null,
  tripOfTheDay: null,
};

export const TripOfTheDayStore = signalStore(
  withState(initialState),
  // On init, we sync with the localstorage to see if trip of the day already exists
  withHooks({
    // Why Trip of The Day stored on localstorage and not app store?
    // Because it needs to be stored even after you refresh or get out of the app
    // (We can sync whole global state with localstorage with third pary libraries or write our own if needed, for now I will use just for trip of the day)
    onInit(
      store,
      localStorageService = inject(LocalStorageService),
      platformId = inject(PLATFORM_ID)
    ) {
      // If it is server, just stay as loading and return. As SSR does not support localstorage;
      if (isPlatformServer(platformId)) {
        return;
      }

      const existentTripOfTheDay = localStorageService.tripOfTheDay;
      // If exists, we check it's not expired, if it is, we remove it, if not, patch state
      if (!existentTripOfTheDay) {
        patchState(store, { state: 'idle' });
        return;
      }

      const now = new Date();
      const expiresIn = new Date(existentTripOfTheDay.expiresIn);

      if (now > expiresIn) {
        localStorageService.removeItem('trip-of-the-day');
        patchState(store, { state: 'idle' });
      } else {
        patchState(store, {
          tripOfTheDay: existentTripOfTheDay.trip,
          expiresIn,
          state: 'idle',
        });
      }
    },
  }),
  withMethods(
    (store, queryBus = inject(QueryBus), localStorageService = inject(LocalStorageService)) => ({
      getTripOfTheDay(params: {
        hooks: {
          onSuccess?: () => void;
          onError: (error: Error) => void;
        };
      }) {
        patchState(store, { state: 'loading' });

        queryBus
          .execute(new GetTripOfTheDayQuery())
          .then(({ trip }) => {
            const tripOfTheDay = { ...trip, score: getTripScore(trip) };
            const expiresIn = getNextDayAtMidnight();

            patchState(store, { tripOfTheDay, expiresIn });

            localStorageService.setItem({
              key: 'trip-of-the-day',
              value: JSON.stringify({ trip: tripOfTheDay, expiresIn }),
            });
          })
          .catch((error: Error) => params.hooks.onError(error))
          .finally(() => patchState(store, { state: 'idle' }));
      },
    })
  )
);

function getNextDayAtMidnight() {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);
  currentDate.setHours(0, 0, 0);

  return currentDate;
}
