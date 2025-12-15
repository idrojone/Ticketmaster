import { Routes } from '@angular/router';

export const dashboardEmpresaRoutes: Routes = [
  {
    path: '',
    redirectTo: 'categorias',
    pathMatch: 'full'
  },
  {
    path: 'categorias',
    loadComponent: () => import('./categorias-empresa/categorias-empresa').then(m => m.CategoriasEmpresa)
  },
  {
    path: 'merchandising',
    loadComponent: () => import('./merchandising-empresa/merchandising-empresa').then(m => m.MerchandisingEmpresa)
  }
];
