import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { createQueryHandler } from '@building-blocks/domain';

import { environment } from 'src/environments/environment';

import { NotFoundError } from '@domain/exceptions';
import { GetTripsQuery } from '@domain/queries';
import { Trip } from '@domain/models';

@Injectable()
export class HttpGetTripsQueryHandler extends createQueryHandler(GetTripsQuery) {
  constructor(private readonly http: HttpClient) {
    super();
  }

  async handle({ filters }: GetTripsQuery): Promise<Trip[]> {
    const primitiveFilters = filters.toPrimitives();

    try {
      const trips = await firstValueFrom(
        this.http.get<Trip[]>(`${environment.SERVER}/v1/trips`, { params: primitiveFilters })
      );

      return trips;
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse) {
        if (error.status === HttpStatusCode.NotFound) {
          throw new NotFoundError();
        }

        // We can handle multiple error types here, use custom exceptions and translate error messages on the UI layer

        throw error;
      }

      throw error;
    }
  }
}
