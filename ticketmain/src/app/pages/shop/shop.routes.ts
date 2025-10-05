import { Routes } from '@angular/router';
import { Shop } from './shop';

export const routes: Routes = [
  {
    path: '',
    component: Shop,
    resolve: {},
  },
  {
    path: 'categories/:slug',
    component: Shop,
    resolve: {},
  },
  {
    path: ':filters',
    component: Shop,
    resolve: {},
  }

];