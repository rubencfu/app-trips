import { Component, ChangeDetectionStrategy, inject, LOCALE_ID } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { HttpGetTripQueryHandler } from 'src/app/infrastructure/query-handlers/http-get-trip.query-handler';
import { registerQueryHandlers } from 'src/app/infrastructure/cqrs.module';

import { StarRatingComponent } from '@shared/components/star-rating/star-rating.component';

import { NotFoundError } from '@domain/exceptions';

import { TripDetailsPageStore } from './trip-details.store';

@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.component.html',
  imports: [CommonModule, RouterModule, NgOptimizedImage, StarRatingComponent],
  providers: [TripDetailsPageStore, registerQueryHandlers([HttpGetTripQueryHandler])],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripDetailsPageComponent {
  protected readonly store = inject(TripDetailsPageStore);
  protected readonly locale = inject(LOCALE_ID);

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly localeCurrencies: Record<string, string> = {
    'en-Us': 'USD',
    es: 'EUR',
  };

  // This can be localized using $localize
  protected readonly scoreProperties = {
    average: { text: 'Average', color: 'bg-neutral-600' },
    good: { text: 'Good', color: 'bg-green-700' },
    awesome: { text: 'Awesome!', color: 'bg-purple-600' },
  };

  constructor() {
    const tripId = this.route.snapshot.params['id'];

    this.store.getTrip({
      tripId,
      hooks: {
        onError: (error) => {
          if (error instanceof NotFoundError) {
            console.error('Not Found', 'No trip found');
            // Redirect
            this.router.navigate(['home']);
            return;
          }

          console.error(error.name, error.message);
        },
      },
    });
  }
}
