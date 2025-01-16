import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { QueryBus } from '@building-blocks/domain';

import { AppStore } from '@shared/state/app.store';

import { FrontendTrip } from '@domain/models';

import { HomePageStore } from './home.store';

describe('Signal Store: Home Store', () => {
  it('should verify that initial state filters are correct', () => {
    const queryBus = {
      execute: () =>
        Promise.resolve({
          items: [{ id: '003', title: 'Example' }],
          total: 1,
        }),
    };

    TestBed.configureTestingModule({
      providers: [
        HomePageStore,
        {
          provide: QueryBus,
          useValue: queryBus,
        },
      ],
    });

    TestBed.configureTestingModule({
      providers: [HomePageStore],
    });

    const store = TestBed.inject(HomePageStore);

    expect(store.maxPages()).toBe(1);
    expect(store.page()).toBe(1);
    expect(store.state()).toBe('idle');
    expect(store.totalItems()).toBe(0);
    expect(store.trips()).toEqual([]);
  });

  it('should set page correctly: page -> 4', () => {
    const queryBus = {
      execute: () =>
        Promise.resolve({
          items: [{ id: '003', title: 'Example' }],
          total: 1,
        }),
    };

    TestBed.configureTestingModule({
      providers: [
        HomePageStore,
        {
          provide: QueryBus,
          useValue: queryBus,
        },
      ],
    });

    const store = TestBed.inject(HomePageStore);

    store.setPage(4);
    expect(store.page()).toBe(4);
  });

  it('should not fetch trip and throw error if invalid filter', () => {
    const queryBus = {
      execute: () =>
        Promise.resolve({
          items: [{ id: '003', title: 'Example' }],
          total: 1,
        }),
    };

    const appStore = {
      filters: () => ({
        limit: 10,
        page: 1,
        sortOrder: 'invalid',
        sortBy: 'creationDate',
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        HomePageStore,
        {
          provide: QueryBus,
          useValue: queryBus,
        },
        {
          provide: AppStore,
          useValue: appStore,
        },
      ],
    });

    const store = TestBed.inject(HomePageStore);

    expect(() => store.getTrips({ hooks: { onError: () => {} } })).toThrowError();
  });

  it('should fetch the Trip correctly', fakeAsync(() => {
    const queryBus = {
      execute: () =>
        Promise.resolve({
          items: [{ id: '003', title: 'Example', co2: 200, rating: 3, nrOfRatings: 100 }],
          total: 1,
        }),
    };

    const appStore = {
      filters: () => ({
        limit: 10,
        page: 1,
        sortOrder: 'DESC',
        sortBy: 'creationDate',
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        HomePageStore,
        {
          provide: QueryBus,
          useValue: queryBus,
        },
        {
          provide: AppStore,
          useValue: appStore,
        },
      ],
    });

    const store = TestBed.inject(HomePageStore);
    store.getTrips({ hooks: { onError: () => {} } });

    expect(store.state()).toBe('loading');

    tick();

    expect(store.totalItems()).toBe(1);
    expect(store.trips()[0]).toEqual({
      id: '003',
      title: 'Example',
      co2: 200,
      rating: 3,
      nrOfRatings: 100,
      score: 'good',
    } as FrontendTrip);
    expect(store.maxPages()).toBe(1);
    expect(store.state()).toBe('idle');
  }));
});
