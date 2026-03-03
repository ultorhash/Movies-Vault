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
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.scss',
})
export class FavoritesComponent {
  private store = inject(Store);
  favorites$ = this.store.select(selectFavorites);

  onRemoveFavorite(movie: Movie) {
    this.store.dispatch(MoviesActions.removeFromFavorites({ movieId: movie.id }));
  }
}
