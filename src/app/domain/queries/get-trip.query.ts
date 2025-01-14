import { createQuery, out, props } from '@building-blocks/domain';
import { Trip } from '@domain/models';

export class GetTripQuery extends createQuery({
  name: 'get-trip',
  in: props<{ tripId: string }>(),
  out: out<{ trip: Trip }>(),
}) {}
