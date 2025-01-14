import { Trip } from './models';

// Here will be saved functions that are related to domain or bussiness logic, to be reused.
// This can be divided into smaller files inside another folder called "Functions" if this file grows too much

/* Note for badges: (personal approach, open to debate, might need some calibrations)
    CO2: Average >= 600 ; good < 600 ; awesome <= 100 (Maybe CO2 should be less important than rating? CO2 awesome === good for weight?)

    rating: Average  <= 2.5 ; good > 3 ; awesome >= 4
    nrOfRatings: Average <= 100 ; good > 100 ; awesome > 500
    unifiedRatings: A trip with awesome nrOfRating but average rating cannot be awesome if CO2 is awesome too (as rating is not good)
    A trip cannot be awesome if it does not have enough number of ratings
  */

// We calculate every field individually, then we do merge ratings as they are related, then we do a weighted average
export function getTripScore({ co2, rating, nrOfRatings }: Trip): 'average' | 'good' | 'awesome' {
  const co2Score = co2 >= 600 ? 'average' : co2 < 100 ? 'awesome' : 'good';

  const ratingScore = rating <= 3 ? 'average' : rating > 4 ? 'awesome' : 'good';

  const nrOfRatingsScore = nrOfRatings <= 100 ? 'average' : nrOfRatings > 500 ? 'awesome' : 'good';

  const points = {
    average: 1,
    good: 2,
    awesome: 3,
  } as const;

  // We separate ratings and nrOfRatings from the main average
  const unifiedRatingPoints = (points[ratingScore] + points[nrOfRatingsScore]) / 2;
  const unifiedRatingScore =
    unifiedRatingPoints >= 2.5 ? 'awesome' : unifiedRatingPoints < 2 ? 'average' : 'good';

  const totalPointsAverage = (points[co2Score] + points[unifiedRatingScore]) / 2;

  // For now, good + awesome = awesome, should be awesome only if two are awesome? (There is so much to discuss!)
  if (totalPointsAverage >= 2.5) {
    return 'awesome';
  }

  if (totalPointsAverage >= 1.5) {
    return 'good';
  }

  return 'average';
}
