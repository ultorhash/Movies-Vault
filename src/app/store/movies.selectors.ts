import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MoviesState } from './movies.reducer';

export const selectMoviesState = createFeatureSelector<MoviesState>('movies');

export const selectAllShows = createSelector(selectMoviesState, (state) => state.shows);

export const selectSearchResults = createSelector(
  selectMoviesState,
  (state) => state.searchResults,
);

export const selectFavorites = createSelector(selectMoviesState, (state) => state.favorites);

export const selectIsLoading = createSelector(selectMoviesState, (state) => state.loading);

export const selectError = createSelector(selectMoviesState, (state) => state.error);

export const selectIsFavorite = (movieId: number) =>
  createSelector(selectFavorites, (favorites) => favorites.some((f) => f.id === movieId));
