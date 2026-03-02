import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of, debounceTime, distinctUntilChanged } from 'rxjs';
import { MoviesService } from '../core/services/movies.service';
import { MoviesActions } from './movies.actions';

@Injectable()
export class MoviesEffects {
    private actions$ = inject(Actions);
    private moviesService = inject(MoviesService);

    loadShows$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MoviesActions.loadShows),
            switchMap(() =>
                this.moviesService.getShows().pipe(
                    map((shows) => MoviesActions.loadShowsSuccess({ shows })),
                    catchError((error) => of(MoviesActions.loadShowsFailure({ error: error.message })))
                )
            )
        )
    );

    searchShows$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MoviesActions.searchShows),
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(({ query }) => {
                if (!query.trim()) return of(MoviesActions.searchShowsSuccess({ shows: [] }));
                return this.moviesService.searchShows(query).pipe(
                    map((shows) => MoviesActions.searchShowsSuccess({ shows })),
                    catchError((error) => of(MoviesActions.searchShowsFailure({ error: error.message })))
                );
            })
        )
    );
}
