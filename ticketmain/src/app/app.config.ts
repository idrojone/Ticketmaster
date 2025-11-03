import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { NoAuthGuard } from './core/guards/no-auth-guard.service';
import { httpTokenInterceptor } from './core/interceptors/http.token.interceptor';
import { routes } from './app.routes';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([httpTokenInterceptor])
    ),
    NoAuthGuard
  ]
  
};
