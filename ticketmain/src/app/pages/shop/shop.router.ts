import { Route } from "@angular/router";
import { Shop } from "./shop";

export default [
    {
        path: '',
        loadComponent: () => import('./shop').then(c => c.Shop)
    },
    {
        path: 'generos/:slug',
        loadComponent: () => import('./shop').then(c => c.Shop)
    },
    {
        path: ':filters',
        loadComponent: () => import('./shop').then(c => c.Shop)
    }
] as Route[]