import { Component, ChangeDetectionStrategy, inject, LOCALE_ID } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HttpGetTripOfTheDayQueryHandler } from 'src/app/infrastructure/query-handlers';
import { registerQueryHandlers } from 'src/app/infrastructure/cqrs.module';

import { StarRatingComponent } from '@shared/components/star-rating/star-rating.component';

import { NotFoundError } from '@domain/exceptions';

import { TripOfTheDayStore } from './trip-of-the-day.store';

// Please note that if this component is needed out of Home view, it can be exported into shared/components
@Component({
  selector: 'app-trip-of-the-day',
  templateUrl: 'trip-of-the-day.component.html',
  imports: [CommonModule, RouterModule, NgOptimizedImage, StarRatingComponent],
  providers: [TripOfTheDayStore, registerQueryHandlers([HttpGetTripOfTheDayQueryHandler])],
  styles: `
    .trip {
      background: radial-gradient(circle at top left, #dffbff, white 80%);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripOfTheDayComponent {
  protected readonly store = inject(TripOfTheDayStore);

  protected readonly localeCurrencies: Record<string, string> = {
    'en-Us': 'USD',
    es: 'EUR',
  };

  protected readonly scoreProperties = {
    average: { text: 'Average', color: 'bg-neutral-600' },
    good: { text: 'Good', color: 'bg-green-700' },
    awesome: { text: 'Awesome!', color: 'bg-purple-600' },
  };

  protected readonly locale = inject(LOCALE_ID);

  // This is called when the button 'See trip of the day' is clicked
  fetchTripOfTheDay() {
    this.store.getTripOfTheDay({
      hooks: {
        onError: (error) => {
          if (error instanceof NotFoundError) {
            console.error('Not Found', 'No trip of the day found');
            return;
          }

          console.error(error.name, error.message);
        },
      },
    });
  }
}
