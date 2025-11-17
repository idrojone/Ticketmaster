import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    redirectTo: 'conciertos',
    pathMatch: 'full'
  },
  {
    path: 'conciertos',
    loadComponent: () => import('../conciertos/conciertos').then(m => m.DashboardConciertos)
  },
  {
    path: 'generos',
    loadComponent: () => import('../generos/generos').then(m => m.DashboardGeneros)
  }
  // {
  //   path: ' merchandising',
  //   loadComponent: () => import('./pages/merchandising/merchandising').then(m => m.DashboardMerchandising)
  // }
];
