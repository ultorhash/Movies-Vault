import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Movie } from '../core/models/movie.model';

export const MoviesActions = createActionGroup({
    source: 'Movies API',
    events: {
        'Load Shows': emptyProps(),
        'Load Shows Success': props<{ shows: Movie[] }>(),
        'Load Shows Failure': props<{ error: string }>(),

        'Search Shows': props<{ query: string }>(),
        'Search Shows Success': props<{ shows: Movie[] }>(),
        'Search Shows Failure': props<{ error: string }>(),

        'Add To Favorites': props<{ movie: Movie }>(),
        'Remove From Favorites': props<{ movieId: number }>(),

        'Update Pagination': props<{ pageIndex: number; pageSize: number }>(),

        'Toggle Theme': emptyProps(),
        'Set Genre Filter': props<{ genre: string | null }>(),
    },
});
