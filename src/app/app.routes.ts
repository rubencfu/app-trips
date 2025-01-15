import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./views/home/home.component').then((m) => m.HomePageComponent),
  },
  {
    path: 'trips/:id',
    loadComponent: () =>
      import('./views/trip-details/trip-details.component').then((m) => m.TripDetailsPageComponent),
  },
  // ** must be always at the bottom, please don't add new routes after this
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
