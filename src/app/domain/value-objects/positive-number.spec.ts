import { PositiveNumber } from './positive-number.value-object';

describe('Value Objects: PositiveNumber', () => {
  it('should create a PositiveNumber instance with a valid number', () => {
    const value = 42;
    const positiveNumber = new PositiveNumber({ value });

    expect(positiveNumber).toBeTruthy();
    expect(positiveNumber.toPrimitives()).toEqual(value);
  });

  it('should allow a value of 0', () => {
    const value = 0;
    const positiveNumber = new PositiveNumber({ value });

    expect(positiveNumber).toBeTruthy();
    expect(positiveNumber.toPrimitives()).toEqual(value);
  });

  it('should throw an error if the value is not a safe integer', () => {
    const unsafeValue = Number.MAX_SAFE_INTEGER + 1;

    expect(() => new PositiveNumber({ value: unsafeValue })).toThrowError(
      `Domain Exception: value must be a safe integer: ${unsafeValue}`
    );
    expect(() => new PositiveNumber({ value: 1.5 })).toThrowError(
      `Domain Exception: value must be a safe integer: 1.5`
    );
  });

  it('should throw an error if the value is negative', () => {
    const negativeValue = -5;

    expect(() => new PositiveNumber({ value: negativeValue })).toThrowError(
      'Domain Exception: value must be positive or 0'
    );
  });
});
