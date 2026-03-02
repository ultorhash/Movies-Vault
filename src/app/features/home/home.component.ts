import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { MoviesActions } from '../../store/movies.actions';
import {
  selectAllShows,
  selectSearchResults,
  selectIsLoading,
  selectFavorites,
} from '../../store/movies.selectors';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card';
import { Movie } from '../../core/models/movie.model';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
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
      </div>

      <div class="loading-spinner" *ngIf="loading$ | async">
        <mat-spinner diameter="50"></mat-spinner>
      </div>

      <div class="movies-grid" *ngIf="!(loading$ | async)">
        <app-movie-card
          *ngFor="let movie of displayedMovies$ | async"
          [movie]="movie"
          [isFavorite]="isMovieFavorite(movie.id)"
          (toggleFavorite)="onToggleFavorite($event)"
        >
        </app-movie-card>
      </div>

      <div
        class="no-results"
        *ngIf="!(loading$ | async) && (displayedMovies$ | async)?.length === 0"
      >
        <mat-icon>search_off</mat-icon>
        <p>No results found. Try another search!</p>
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
      }

      h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        background: linear-gradient(45deg, #fff, #aaa);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .search-field {
        width: 100%;
        max-width: 600px;
      }

      .movies-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 2rem;
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

  // Combine shows and search results logic
  displayedMovies$ = this.store.select((state) => {
    const results = selectSearchResults(state);
    return results.length > 0 ? results : selectAllShows(state);
  });

  ngOnInit() {
    this.store.dispatch(MoviesActions.loadShows());
    this.store.select(selectFavorites).subscribe((favs) => (this.favorites = favs));
  }

  onSearchChange(query: string) {
    this.store.dispatch(MoviesActions.searchShows({ query }));
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
