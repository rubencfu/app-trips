import { AppStore } from './app.store';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

describe('Signal Store: App Store', () => {
  it('should verify that initial state filters are the correct 4 options', () => {
    const store = TestBed.inject(AppStore);

    expect(store.filters()).toEqual({
      limit: 10,
      page: 1,
      sortOrder: 'DESC',
      sortBy: 'creationDate',
    });
  });

  it('should patch filters correctly: page -> 2', () => {
    const store = TestBed.inject(AppStore);

    store.patchFilters({ page: 2 });
    expect(store.filters().page).toBe(2);
  });

  it('should reset filters correctly', fakeAsync(() => {
    const store = TestBed.inject(AppStore);

    store.patchFilters({
      page: 2,
      limit: 100,
      maxPrice: 500,
      minPrice: 10,
      minRating: 1,
      sortBy: 'price',
      sortOrder: 'ASC',
    });

    tick();

    store.resetFilters();

    expect(store.filters()).toEqual({
      limit: 10,
      page: 1,
      sortOrder: 'DESC',
      sortBy: 'creationDate',
    });
  }));
});
