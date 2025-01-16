import { TripFiltersVO } from './trip-filters.value-object';
import { NonEmptyString } from './non-empty-string.value-object';
import { PositiveNumber } from './positive-number.value-object';

describe('Value Objects: TripFilters', () => {
  it('should create a TripFiltersVO instance with valid props', () => {
    const validTitleFilter = new NonEmptyString({ value: 'Trip Title' });
    const validMinPrice = new PositiveNumber({ value: 100 });
    const validMaxPrice = new PositiveNumber({ value: 500 });
    const validMinRating = new PositiveNumber({ value: 4 });
    const validTags = new NonEmptyString({ value: 'city' });
    const validPage = new PositiveNumber({ value: 1 });
    const validLimit = new PositiveNumber({ value: 20 });

    const filters = new TripFiltersVO({
      sortBy: 'price',
      sortOrder: 'ASC',
      titleFilter: validTitleFilter,
      minPrice: validMinPrice,
      maxPrice: validMaxPrice,
      minRating: validMinRating,
      tags: validTags,
      page: validPage,
      limit: validLimit,
    });

    expect(filters).toBeTruthy();
    expect(filters.toPrimitives()).toEqual({
      sortBy: 'price',
      sortOrder: 'ASC',
      titleFilter: 'Trip Title',
      minPrice: 100,
      maxPrice: 500,
      minRating: 4,
      tags: 'city',
      page: 1,
      limit: 20,
    });
  });

  it('should allow partial properties', () => {
    const filters = new TripFiltersVO({
      sortBy: 'title',
      sortOrder: 'DESC',
      titleFilter: new NonEmptyString({ value: 'Trip Title' }),
    });

    expect(filters.toPrimitives()).toEqual({
      sortBy: 'title',
      sortOrder: 'DESC',
      titleFilter: 'Trip Title',
      limit: undefined,
      maxPrice: undefined,
      minPrice: undefined,
      minRating: undefined,
      page: undefined,
      tags: undefined,
    });
  });

  it('should throw an error for invalid sortBy values', () => {
    expect(() => new TripFiltersVO({ sortBy: 'invalid' as any })).toThrowError(
      'Domain Exception: sortBy should be title, price, rating or creationDate'
    );
  });

  it('should throw an error for invalid sortOrder values', () => {
    expect(() => new TripFiltersVO({ sortOrder: 'invalid' as any })).toThrowError(
      'Domain Exception: sortOrder should be ASC or DESC'
    );
  });
});
