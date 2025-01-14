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
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
