import { Injectable } from '@angular/core';

import { Nullish } from '@shared-kernel/types';

import { FrontendTrip } from '@domain/models';

// Services that are only Angular/Frontend related will be at this layer, shared, don't need abstraction
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  setItem({ key, value }: { key: string; value: string }) {
    localStorage.setItem(key, value);
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }

  // We can also leave this as get item(key) and do the parsing on the other class, but here is more reusable
  public get tripOfTheDay(): Nullish<{ trip: FrontendTrip; expiresIn: Date }> {
    const storageItem = localStorage.getItem('trip-of-the-day');

    if (storageItem) {
      return JSON.parse(storageItem) as { trip: FrontendTrip; expiresIn: Date };
    }

    return;
  }
}
