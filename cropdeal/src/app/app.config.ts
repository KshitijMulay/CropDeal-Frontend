import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
// import { ScrollAnimateDirective } from './directives/scroll-animate.directive';
// import { provideDirectives } from '@angular/core';
import { routes } from './app.routes';
import { provideHttpClient,withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth/token.interceptor';
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),   provideRouter(routes),provideHttpClient(withInterceptors([authInterceptor]))]
};
// provideDirectives([ScrollAnimateDirective]),