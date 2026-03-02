import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatChipsModule, MatChipSelectionChange } from '@angular/material/chips';
import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { MoviesActions } from '../../store/movies.actions';
import {
  selectIsLoading,
  selectFavorites,
  selectPaginatedMovies,
  selectTotalItems,
  selectPageSize,
  selectPageIndex,
  selectAvailableGenres,
  selectSelectedGenre,
} from '../../store/movies.selectors';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card';
import { Movie } from '../../core/models/movie.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatChipsModule,
    FormsModule,
    MovieCardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  private store = inject(Store);

  searchQuery = '';
  loading$ = this.store.select(selectIsLoading);
  favorites: Movie[] = [];

  displayedMovies$ = this.store.select(selectPaginatedMovies);
  totalItems$ = this.store.select(selectTotalItems);
  pageSize$ = this.store.select(selectPageSize);
  pageIndex$ = this.store.select(selectPageIndex);
  availableGenres$ = this.store.select(selectAvailableGenres);
  selectedGenre$ = this.store.select(selectSelectedGenre);

  ngOnInit() {
    this.store.dispatch(MoviesActions.loadShows());
    this.store.select(selectFavorites).subscribe((favs: Movie[]) => (this.favorites = favs));
  }

  onSearchChange(query: string) {
    this.store.dispatch(MoviesActions.searchShows({ query }));
  }

  onGenreChange(genre: string | null) {
    this.store.dispatch(MoviesActions.setGenreFilter({ genre }));
  }

  onPageChange(event: PageEvent) {
    this.store.dispatch(
      MoviesActions.updatePagination({
        pageIndex: event.pageIndex,
        pageSize: event.pageSize,
      })
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  isMovieFavorite(id: number): boolean {
    return this.favorites.some((f) => f.id === id);
  }

  onToggleFavorite(movie: Movie) {
    if (this.isMovieFavorite(movie.id)) {
      this.store.dispatch(MoviesActions.removeFromFavorites({ movieId: movie.id }));
    } else {
      this.store.dispatch(MoviesActions.addToFavorites({ movie }));
    }
  }
}
