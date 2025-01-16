import { getTripScore } from './functions';
import { Trip } from './models';

// If the logic of the function is modified, those tests should be modified too
describe('Domain Functions: getTripScore', () => {
  it('should return average', () => {
    const input = { co2: 800, rating: 2, nrOfRatings: 90 } as Trip;

    const result = getTripScore(input);

    expect(result).toBe('average');
  });

  it('should return good', () => {
    const input = { co2: 300, rating: 3.2, nrOfRatings: 190 } as Trip;

    const result = getTripScore(input);

    expect(result).toBe('good');
  });

  it('should return awesome', () => {
    const input = { co2: 20, rating: 4, nrOfRatings: 390 } as Trip;

    const result = getTripScore(input);

    expect(result).toBe('awesome');
  });
});
