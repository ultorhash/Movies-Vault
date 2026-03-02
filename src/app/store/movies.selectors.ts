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

export const selectError = createSelector(
  selectMoviesState,
  (state) => state.error
);

export const selectPageSize = createSelector(
  selectMoviesState,
  (state) => state.pageSize
);

export const selectPageIndex = createSelector(
  selectMoviesState,
  (state) => state.pageIndex
);

export const selectCurrentMovieList = createSelector(
  selectAllShows,
  selectSearchResults,
  (shows, searchResults) => (searchResults.length > 0 ? searchResults : shows)
);

export const selectTotalItems = createSelector(
  selectCurrentMovieList,
  (movies) => movies.length
);

export const selectPaginatedMovies = createSelector(
  selectCurrentMovieList,
  selectPageIndex,
  selectPageSize,
  (movies, pageIndex, pageSize) => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return movies.slice(start, end);
  }
);

export const selectIsDarkMode = createSelector(selectMoviesState, (state) => state.isDarkMode);

export const selectIsFavorite = (movieId: number) =>
  createSelector(selectFavorites, (favorites) => favorites.some((f) => f.id === movieId));
