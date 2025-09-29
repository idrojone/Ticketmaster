import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home)
    },
    {
        path: 'shop', loadComponent: () => import('./pages/shop/shop').then(m => m.Shop)
    },
    {
        path: 'details/concierto/:slug', 
        loadComponent: () => import('./pages/details/details.component').then(m => m.DetailsComponent),
        resolve: {
            concierto: () => import('./pages/details/details-resolver.service').then(m => m.DetailsResolver)
        }
    },
    // Ruta futura para festivales
    // {
    //     path: 'details/festival/:slug', 
    //     loadComponent: () => import('./pages/details/details.component').then(m => m.DetailsComponent),
    //     resolve: {
    //         festival: () => import('./pages/details/details-resolver.service').then(m => m.DetailsResolver)
    //     }
    // }
];
