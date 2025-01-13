import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { TripFilters } from '@domain/models';

/* This will be our global state, only neccessary because we need 
   to maintain filters/sorting between navigations
*/
export interface AppState {
  filters: Partial<TripFilters>;
}

const initialState: AppState = {
  filters: {
    limit: 10,
    page: 1,
    sortOrder: 'DESC',
    sortBy: 'creationDate',
  },
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    // We only set new filters, respecting already set ones
    patchFilters(filters: Partial<TripFilters>) {
      patchState(store, { filters: { ...store.filters(), ...filters } });
    },
    resetFilters() {
      patchState(store, { filters: initialState.filters });
    },
  }))
);
