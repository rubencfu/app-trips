import { createQuery, out, props } from '@building-blocks/domain';
import { Trip } from '@domain/models';

export class GetTripOfTheDayQuery extends createQuery({
  name: 'get-trip-of-the-day',
  in: props<void>(),
  out: out<{ trip: Trip }>(),
}) {}
