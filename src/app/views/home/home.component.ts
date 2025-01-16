import { Component, ChangeDetectionStrategy, inject, LOCALE_ID } from '@angular/core';
import { CommonModule, Location, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';

import { HttpGetTripsQueryHandler } from 'src/app/infrastructure/query-handlers';
import { registerQueryHandlers } from 'src/app/infrastructure/cqrs.module';

import { StarRatingComponent } from '@shared/components/star-rating/star-rating.component';
import { AppStore } from '@shared/state/app.store';

import { NotFoundError } from '@domain/exceptions';

import { TripOfTheDayComponent } from './components/trip-of-the-day/trip-of-the-day.component';
import { TripFiltersComponent } from './components/trip-filters/trip-filters.component';
import { HomePageStore } from './home.store';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    CommonModule,
    RouterModule,
    NgOptimizedImage,
    StarRatingComponent,
    TripFiltersComponent,
    TripOfTheDayComponent,
  ],
  providers: [HomePageStore, registerQueryHandlers([HttpGetTripsQueryHandler])],
  styles: `
    .trip {
      background: radial-gradient(circle at top left, #dffbff, white 80%);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  protected readonly store = inject(HomePageStore);
  protected readonly appStore = inject(AppStore);
  protected readonly locale = inject(LOCALE_ID);

  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  // If we want more countries for our app, we should pass this object to a Global Constant and add more countries with their currencies (and istall i18n)
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
    const queryParams = this.route.snapshot.queryParams;
    this.checkQueryParams(queryParams);

    this.fetchTrips();
  }

  // As home is the parent component, it has the responsability to sync params and store [route=home]
  checkQueryParams(params: Params) {
    const page = Number(params['page']) || 1;

    // We check the query params, we merge the url query params with the store, as url has priority
    this.appStore.patchFilters({
      ...params,
      page,
      limit: Number(params['limit'] || 10),
    });
    this.store.setPage(page);

    // Then we sync store with url params
    this.updateParams();
  }

  // We change the page in the app store and in the url and then call for trips again
  getPage(page: number | string) {
    const absolutePage = Number(page);
    if (isNaN(absolutePage)) {
      return;
    }
    const maxPage = this.store.maxPages();

    const coercedPage = absolutePage <= 1 ? 1 : absolutePage > maxPage ? maxPage : absolutePage;

    this.appStore.patchFilters({ page: coercedPage });
    this.store.setPage(coercedPage);

    this.updateParams();

    this.fetchTrips();
  }

  updateParams() {
    const urlTree = this.router.createUrlTree([], {
      queryParams: this.appStore.filters(),
      queryParamsHandling: 'merge',
      preserveFragment: true,
    });
    this.location.go(urlTree.toString());
  }

  fetchTrips() {
    this.store.getTrips({
      hooks: {
        onSuccess: () => {
          // We could do something here, or just remove this callback
        },
        onError: (error) => {
          // We could use a toast or another visual element, and translate the message using $localize
          if (error instanceof NotFoundError) {
            console.error('Not Found', 'No trips found for this query');
            return;
          }

          console.error(error.name, error.message);
        },
      },
    });
  }
}
