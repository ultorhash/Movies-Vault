import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectFavorites } from '../../store/movies.selectors';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card';
import { Movie } from '../../core/models/movie.model';
import { MoviesActions } from '../../store/movies.actions';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, MatIconModule, RouterLink, MatButtonModule],
  template: `
    <div class="favorites-container">
      <div class="header">
        <h1>Your Favorites</h1>
        <p *ngIf="(favorites$ | async)?.length === 0">
          You haven't added any movies to your favorites yet.
        </p>
      </div>

      <div class="movies-grid" *ngIf="(favorites$ | async)?.length! > 0">
        <app-movie-card
          *ngFor="let movie of favorites$ | async"
          [movie]="movie"
          [isFavorite]="true"
          (toggleFavorite)="onRemoveFavorite($event)"
        >
        </app-movie-card>
      </div>

      <div class="empty-state" *ngIf="(favorites$ | async)?.length === 0">
        <mat-icon>favorite_border</mat-icon>
        <button mat-raised-button color="primary" routerLink="/">EXPLORE MOVIES</button>
      </div>
    </div>
  `,
  styles: [
    `
      .favorites-container {
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
      }

      .header {
        margin-bottom: 3rem;
        text-align: center;
      }

      h1 {
        font-size: 2.5rem;
        font-weight: 700;
        background: linear-gradient(45deg, #ff4081, #ff80ab);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .movies-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 2rem;
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
        padding: 4rem;
        color: rgba(255, 255, 255, 0.3);
      }

      .empty-state mat-icon {
        font-size: 6rem;
        width: 6rem;
        height: 6rem;
      }
    `,
  ],
})
export class FavoritesComponent {
  private store = inject(Store);
  favorites$ = this.store.select(selectFavorites);

  onRemoveFavorite(movie: Movie) {
    this.store.dispatch(MoviesActions.removeFromFavorites({ movieId: movie.id }));
  }
}
