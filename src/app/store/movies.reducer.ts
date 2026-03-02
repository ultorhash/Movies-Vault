import { createReducer, on } from '@ngrx/store';
import { Movie } from '../core/models/movie.model';
import { MoviesActions } from './movies.actions';

export interface MoviesState {
    shows: Movie[];
    searchResults: Movie[];
    favorites: Movie[];
    loading: boolean;
    error: string | null;
}

export const initialState: MoviesState = {
    shows: [],
    searchResults: [],
    favorites: [],
    loading: false,
    error: null,
};

export const moviesReducer = createReducer(
    initialState,
    on(MoviesActions.loadShows, (state) => ({ ...state, loading: true })),
    on(MoviesActions.loadShowsSuccess, (state, { shows }) => ({ ...state, shows, loading: false })),
    on(MoviesActions.loadShowsFailure, (state, { error }) => ({ ...state, error, loading: false })),

    on(MoviesActions.searchShows, (state) => ({ ...state, loading: true })),
    on(MoviesActions.searchShowsSuccess, (state, { shows }) => ({ ...state, searchResults: shows, loading: false })),
    on(MoviesActions.searchShowsFailure, (state, { error }) => ({ ...state, error, loading: false })),

    on(MoviesActions.addToFavorites, (state, { movie }) => {
        if (state.favorites.some(f => f.id === movie.id)) return state;
        return { ...state, favorites: [...state.favorites, movie] };
    }),
    on(MoviesActions.removeFromFavorites, (state, { movieId }) => ({
        ...state,
        favorites: state.favorites.filter(f => f.id !== movieId)
    }))
);
