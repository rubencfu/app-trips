import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { GetOutput, createQueryHandler } from '@building-blocks/domain';

import { environment } from 'src/environments/environment';

import { NotFoundError } from '@domain/exceptions';
import { GetTripQuery } from '@domain/queries';
import { Trip } from '@domain/models';

@Injectable()
export class HttpGetTripQueryHandler extends createQueryHandler(GetTripQuery) {
  constructor(private readonly http: HttpClient) {
    super();
  }

  async handle({ tripId }: GetTripQuery): Promise<GetOutput<GetTripQuery>> {
    try {
      const trip = await firstValueFrom(
        this.http.get<Trip>(`${environment.SERVER}/v1/trips/${tripId}`)
      );

      // Why is backend not throwing 404?
      if (!trip) {
        throw new NotFoundError();
      }
      return { trip };
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse) {
        if (error.status === HttpStatusCode.NotFound) {
          throw new NotFoundError();
        }

        throw error;
      }

      throw error;
    }
  }
}
