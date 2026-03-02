import { createReducer, on } from '@ngrx/store';
import { Movie } from '../core/models/movie.model';
import { MoviesActions } from './movies.actions';

export interface MoviesState {
  shows: Movie[];
  searchResults: Movie[];
  favorites: Movie[];
  loading: boolean;
  error: string | null;
  pageSize: number;
  pageIndex: number;
  isDarkMode: boolean;
  selectedGenre: string | null;
}

export const initialState: MoviesState = {
  shows: [],
  searchResults: [],
  favorites: [],
  loading: false,
  error: null,
  pageSize: 20,
  pageIndex: 0,
  isDarkMode: true,
  selectedGenre: null,
};

export const moviesReducer = createReducer(
  initialState,
  on(MoviesActions.loadShows, (state) => ({ ...state, loading: true, pageIndex: 0 })),
  on(MoviesActions.loadShowsSuccess, (state, { shows }) => ({ ...state, shows, loading: false })),
  on(MoviesActions.loadShowsFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(MoviesActions.searchShows, (state) => ({ ...state, loading: true, pageIndex: 0 })),
  on(MoviesActions.searchShowsSuccess, (state, { shows }) => ({
    ...state,
    searchResults: shows,
    loading: false,
  })),
  on(MoviesActions.searchShowsFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(MoviesActions.updatePagination, (state, { pageIndex, pageSize }) => ({
    ...state,
    pageIndex,
    pageSize,
  })),

  on(MoviesActions.toggleTheme, (state) => ({
    ...state,
    isDarkMode: !state.isDarkMode,
  })),
  on(MoviesActions.setGenreFilter, (state, { genre }) => ({
    ...state,
    selectedGenre: genre,
    pageIndex: 0,
  })),

  on(MoviesActions.addToFavorites, (state, { movie }) => {
    if (state.favorites.some((f) => f.id === movie.id)) return state;
    return { ...state, favorites: [...state.favorites, movie] };
  }),
  on(MoviesActions.removeFromFavorites, (state, { movieId }) => ({
    ...state,
    favorites: state.favorites.filter((f) => f.id !== movieId),
  })),
);
