import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home)
    },
    {
        path: 'shop', loadComponent: () => import('./pages/shop/shop').then(m => m.Shop)
    }
];
