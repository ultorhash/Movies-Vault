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
  template: `
    <div class="home-container">
      <div class="search-header">
        <h1>Explore Movies & TV Shows</h1>
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search for a movie...</mat-label>
          <input
            matInput
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange($event)"
            placeholder="Type to search..."
          />
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <div class="genre-filters" *ngIf="(availableGenres$ | async)?.length">
          <mat-chip-listbox
            aria-label="Genre selection"
            [value]="selectedGenre$ | async"
            (change)="onGenreChange($event.value)"
          >
            <mat-chip-option *ngFor="let genre of availableGenres$ | async" [value]="genre">
              {{ genre }}
            </mat-chip-option>
          </mat-chip-listbox>
        </div>
      </div>

      <div class="loading-spinner" *ngIf="loading$ | async">
        <mat-spinner diameter="50"></mat-spinner>
      </div>

      <div class="results-area" *ngIf="!(loading$ | async)">
        <div class="movies-grid">
          <app-movie-card
            *ngFor="let movie of displayedMovies$ | async"
            [movie]="movie"
            [isFavorite]="isMovieFavorite(movie.id)"
            (toggleFavorite)="onToggleFavorite($event)"
          >
          </app-movie-card>
        </div>

        <mat-paginator
          *ngIf="(totalItems$ | async)! > 0"
          [length]="totalItems$ | async"
          [pageSize]="pageSize$ | async"
          [pageIndex]="pageIndex$ | async"
          [pageSizeOptions]="[10, 20, 40, 100]"
          (page)="onPageChange($event)"
          class="custom-paginator"
        >
        </mat-paginator>
      </div>

      <div class="no-results" *ngIf="!(loading$ | async) && (totalItems$ | async) === 0">
        <mat-icon>search_off</mat-icon>
        <p>No results found. Try another search or different genre!</p>
      </div>
    </div>
  `,
  styles: [
    `
      .home-container {
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
      }

      .search-header {
        text-align: center;
        margin-bottom: 3rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
      }

      h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0;
        background: linear-gradient(45deg, #fff, #aaa);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .search-field {
        width: 100%;
        max-width: 600px;
      }

      .genre-filters {
        width: 100%;
        display: flex;
        justify-content: center;
        overflow-x: auto;
        padding: 0.5rem 0;
      }

      .genre-filters mat-chip-listbox {
        --mdc-chip-elevated-container-color: rgba(255, 255, 255, 0.05);
        --mdc-chip-label-text-color: var(--text-muted);
        --mdc-chip-selected-container-color: var(--primary-color);
        --mdc-chip-selected-label-text-color: #fff;
      }

      .movies-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
      }

      .custom-paginator {
        background: rgba(255, 255, 255, 0.05) !important;
        border-radius: 12px;
        color: #fff !important;
        margin-top: 2rem;
      }

      .loading-spinner {
        display: flex;
        justify-content: center;
        padding: 4rem;
      }

      .no-results {
        text-align: center;
        padding: 4rem;
        color: rgba(255, 255, 255, 0.5);
      }

      .no-results mat-icon {
        font-size: 4rem;
        width: 4rem;
        height: 4rem;
        margin-bottom: 1rem;
      }
    `,
  ],
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
