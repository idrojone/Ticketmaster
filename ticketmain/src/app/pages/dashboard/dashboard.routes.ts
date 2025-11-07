import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    redirectTo: 'conciertos',
    pathMatch: 'full'
  },
  {
    path: 'conciertos',
    loadComponent: () => import('./pages/conciertos/conciertos').then(m => m.DashboardConciertos)
  },
  {
    path: 'generos',
    loadComponent: () => import('./pages/generos/generos').then(m => m.DashboardGeneros)
  }
];
