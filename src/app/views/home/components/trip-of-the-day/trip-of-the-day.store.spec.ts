import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { QueryBus } from '@building-blocks/domain';
import { TripOfTheDayStore } from './trip-of-the-day.store';

describe('Signal Store: Trip Of The Day Store', () => {
  it('should fetch the Trip', fakeAsync(() => {
    const queryBus = {
      execute: () =>
        Promise.resolve({
          trip: { id: '003', title: 'Example' },
        }),
    };

    TestBed.configureTestingModule({
      providers: [
        TripOfTheDayStore,
        {
          provide: QueryBus,
          useValue: queryBus,
        },
      ],
    });

    const store = TestBed.inject(TripOfTheDayStore);
    store.getTripOfTheDay({ hooks: { onError: () => {} } });

    expect(store.state()).toBe('loading');

    tick();

    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    tomorrowDate.setHours(0, 0, 0);

    expect(store.tripOfTheDay()).toBeTruthy();
    expect(store.expiresIn()).toEqual(tomorrowDate);
    expect(store.tripOfTheDay()?.id).toBe('003');
    expect(store.state()).toBe('idle');
  }));
});
