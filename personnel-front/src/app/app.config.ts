//src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/aura'; // Example theme
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { JwtModule } from '@auth0/angular-jwt';
import { tokenGetter } from './auth.config';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          headerName: 'authorization',
          allowedDomains: ['localhost:8080'],
          disallowedRoutes: ['localhost:8080/api/login']
        }
      })
    ),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    providePrimeNG({
      theme: {
        preset: Lara, // Use an official PrimeNG theme
        options: {
          darkModeSelector: false,
          // KEY: Set the CSS layer to ensure correct specificity
          cssLayer: {
            name: 'primeng',
            // Order must place the theme/base layer before the primeng layer
            // and the primeng layer before other utilities (like Tailwind).
            // A common and safe order is 'theme, base, primeng' for Tailwind v4 compatibility.
            order: 'theme, base, primeng' 
          }
        }
      }
    })
  ]
};