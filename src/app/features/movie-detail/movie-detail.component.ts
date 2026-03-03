import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MoviesService } from '../../core/services/movies.service';
import { Movie } from '../../core/models/movie.model';
import { MoviesActions } from '../../store/movies.actions';
import { selectFavorites } from '../../store/movies.selectors';
import { Observable, map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.scss',
})
export class MovieDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private moviesService = inject(MoviesService);
  private store = inject(Store);

  movie$!: Observable<Movie>;
  favorites: Movie[] = [];

  ngOnInit() {
    this.movie$ = this.route.params.pipe(
      map((params) => +params['id']),
      switchMap((id) => this.moviesService.getShowById(id)),
    );

    this.store.select(selectFavorites).subscribe((favs) => (this.favorites = favs));
  }

  isFavorite(id: number): boolean {
    return this.favorites.some((f) => f.id === id);
  }

  toggleFavorite(movie: Movie) {
    if (this.isFavorite(movie.id)) {
      this.store.dispatch(MoviesActions.removeFromFavorites({ movieId: movie.id }));
    } else {
      this.store.dispatch(MoviesActions.addToFavorites({ movie }));
    }
  }
}
