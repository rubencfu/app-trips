import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { GetOutput, createQueryHandler } from '@building-blocks/domain';

import { environment } from 'src/environments/environment';

import { GetTripOfTheDayQuery } from '@domain/queries';
import { NotFoundError } from '@domain/exceptions';
import { Trip } from '@domain/models';

@Injectable()
export class HttpGetTripOfTheDayQueryHandler extends createQueryHandler(GetTripOfTheDayQuery) {
  constructor(private readonly http: HttpClient) {
    super();
  }

  async handle(): Promise<GetOutput<GetTripOfTheDayQuery>> {
    try {
      const trip = await firstValueFrom(
        this.http.get<Trip>(`${environment.SERVER}/v1/trips/random/trip-of-the-day`)
      );

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
