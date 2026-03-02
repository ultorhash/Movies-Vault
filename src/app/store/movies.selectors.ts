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

export const selectSelectedGenre = createSelector(
  selectMoviesState,
  (state) => state.selectedGenre
);

export const selectAvailableGenres = createSelector(
  selectCurrentMovieList,
  (movies) => {
    const genres = new Set<string>();
    movies.forEach((m) => m.genres?.forEach((g) => genres.add(g)));
    return Array.from(genres).sort();
  }
);

export const selectFilteredMovies = createSelector(
  selectCurrentMovieList,
  selectSelectedGenre,
  (movies, selectedGenre) => {
    if (!selectedGenre) return movies;
    return movies.filter((m) => m.genres?.includes(selectedGenre));
  }
);

export const selectTotalItems = createSelector(
  selectFilteredMovies,
  (movies) => movies.length
);

export const selectPaginatedMovies = createSelector(
  selectFilteredMovies,
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
