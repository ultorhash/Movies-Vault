import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { routes } from './app.routes';
import { moviesReducer } from './store/movies.reducer';
import { MoviesEffects } from './store/movies.effects';

import { MatPaginatorIntl } from '@angular/material/paginator';

function getCustomPaginatorIntl() {
  const customIntl = new MatPaginatorIntl();
  customIntl.itemsPerPageLabel = 'Movies per page';
  return customIntl;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({ movies: moviesReducer }),
    provideEffects(MoviesEffects),
    { provide: MatPaginatorIntl, useFactory: getCustomPaginatorIntl },
  ],
};
