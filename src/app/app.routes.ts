import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing').then((m) => m.Landing),
  },
  {
    path: 'locations',
    loadComponent: () =>
      import('./pages/location-list/location-list').then((m) => m.LocationList),
  },
  {
    path: 'locations/new',
    loadComponent: () =>
      import('./pages/location-create/location-create').then((m) => m.LocationCreate),
  },
  {
    path: 'locations/:id/edit',
    loadComponent: () =>
      import('./pages/location-create/location-create').then((m) => m.LocationCreate),
  },
  {
    path: 'location/:id',
    loadComponent: () =>
      import('./pages/location-detail/location-detail').then((m) => m.LocationDetail),
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings').then((m) => m.Settings),
  },
];
