import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home)
    },
    {
        path: 'shop', loadChildren: () => import('./pages/shop/shop.routes').then(m => m.routes)
    },
    {
        path: 'shop/generos/:slug', 
        loadComponent: () => import('./pages/shop/shop').then(m => m.Shop)
    },
    {
        path: 'details/concierto/:slug', 
        loadComponent: () => import('./pages/details/details.component').then(m => m.DetailsComponent),
        resolve: {
            concierto: () => import('./pages/details/details-resolver.service').then(m => m.DetailsResolver)
        }
    },
];
