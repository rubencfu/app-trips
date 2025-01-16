import { NonEmptyString } from './non-empty-string.value-object';

describe('Value Objects: NonEmptyString', () => {
  it('should create a NonEmptyString instance with a valid string', () => {
    const value = 'Example';
    const nonEmptyString = new NonEmptyString({ value });

    expect(nonEmptyString).toBeTruthy();
    expect(nonEmptyString.toPrimitives()).toEqual(value);
  });

  it('should throw an error if the value is not a string', () => {
    expect(() => new NonEmptyString({ value: 123 as any })).toThrowError(
      'Domain Exception: value must be a string'
    );
  });

  it('should throw an error if the value is an empty string', () => {
    expect(() => new NonEmptyString({ value: '' })).toThrowError(
      'Domain Exception: value must not be empty'
    );
  });
});
