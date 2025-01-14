import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';

import { DoubleRangeSliderComponent } from '@shared/components/double-range-slider/double-range-slider.component';
import { DropdownComponent } from '@shared/components/dropdown/dropdown.component';
import { AppStore } from '@shared/state/app.store';

import { TripSortByOptions } from '@domain/models';

@Component({
  selector: 'app-trip-filters',
  templateUrl: './trip-filters.component.html',
  imports: [CommonModule, ReactiveFormsModule, DropdownComponent, DoubleRangeSliderComponent],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripFiltersComponent {
  // We use this output to notify parent component that filters have changed
  onFilterChange = output<void>();

  // We can also use formbuilder.nonNullable for big non nullable forms
  filtersForm = new FormGroup({
    sortBy: new FormControl<TripSortByOptions>('creationDate', { nonNullable: true }),
    sortOrder: new FormControl<'ASC' | 'DESC'>('DESC', { nonNullable: true }),
    titleFilter: new FormControl<string>('', { nonNullable: true }),
    price: new FormControl<{ min: number; max: number }>(
      // We set max as 10,000, but this can be discussed with the product team or add an "any" option
      { min: 0, max: 10_000 },
      { nonNullable: true }
    ),
    minRating: new FormControl<number>(0, { nonNullable: true }),
    tags: new FormControl<string>('', { nonNullable: true }),
    limit: new FormControl<number>(10, {
      nonNullable: true,
    }),
  });

  // We can localize labels using $localize
  protected readonly sortByDropdown = [
    { label: 'Price', value: 'price' },
    { label: 'Title', value: 'title' },
    { label: 'Rating', value: 'rating' },
    { label: 'Creation Date', value: 'creationDate' },
  ];

  // This component will use only the app store, and won't have a local store
  protected readonly appStore = inject(AppStore);

  private readonly location = inject(Location);
  private readonly router = inject(Router);

  constructor() {
    this.checkStoreFilters();
  }

  checkStoreFilters() {
    const storeFilters = this.appStore.filters();

    // We update the form from the appStore that should have been synced with the url from the parent component
    this.filtersForm.patchValue({
      limit: storeFilters.limit || 10,
      minRating: storeFilters.minRating || 0,
      price: {
        min: storeFilters.minPrice || 0,
        max: storeFilters.maxPrice || 10_000,
      },
      sortBy: storeFilters.sortBy,
      sortOrder: storeFilters.sortOrder,
      tags: storeFilters.tags,
      titleFilter: storeFilters.titleFilter,
    });
  }

  onFormValueChange() {
    const formValue = this.filtersForm.getRawValue();

    const fixedValue = {
      titleFilter: formValue.titleFilter === '' ? undefined : formValue.titleFilter,
      tags: formValue.tags === '' ? undefined : formValue.tags,
      maxPrice: formValue.price.max,
      minPrice: formValue.price.min,
      minRating: formValue.minRating,
      sortBy: formValue.sortBy,
      sortOrder: formValue.sortOrder,
      limit: formValue.limit,
    };

    this.appStore.patchFilters(fixedValue);

    this.updateParams();

    this.onFilterChange.emit();
  }

  toggleOrder() {
    const newOrder = this.appStore.filters().sortOrder === 'DESC' ? 'ASC' : 'DESC';
    this.filtersForm.patchValue({ sortOrder: newOrder });

    this.onFormValueChange();
  }

  updateParams() {
    const urlTree = this.router.createUrlTree([], {
      queryParams: this.appStore.filters(),
      queryParamsHandling: 'merge',
      preserveFragment: true,
    });
    this.location.go(urlTree.toString());
  }

  resetFilters() {
    this.appStore.resetFilters();

    this.filtersForm.reset({}, { emitEvent: false });

    this.onFormValueChange();
  }
}
