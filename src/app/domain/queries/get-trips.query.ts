import { createQuery, out, props } from '@building-blocks/domain';
import { Trip } from '@domain/models';

import { TripFiltersVO } from '@domain/value-objects';

// Queries are easy to read. Value Object is passed as prop so filters will be validated if present
export class GetTripsQuery extends createQuery({
  name: 'get-trips',
  in: props<{ filters: TripFiltersVO }>(),
  out: out<{ items: Trip[]; total: number; page: number; limit: number }>(),
}) {}
