import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { QueryBus } from '@building-blocks/domain';

import { TripDetailsPageStore } from './trip-details.store';

// Here is how we mock a query
describe('Signal Store: Trip Details Store', () => {
  it('should fetch the Trip', fakeAsync(() => {
    const queryBus = {
      execute: () =>
        Promise.resolve({
          trip: { id: '003', title: 'Example' },
        }),
    };

    TestBed.configureTestingModule({
      providers: [
        TripDetailsPageStore,
        {
          provide: QueryBus,
          useValue: queryBus,
        },
      ],
    });

    const store = TestBed.inject(TripDetailsPageStore);
    store.getTrip({ tripId: '003', hooks: { onError: () => {} } });

    expect(store.state()).toBe('loading');

    tick();

    expect(store.trip().id).toBe('003');
    expect(store.state()).toBe('idle');
  }));
});
