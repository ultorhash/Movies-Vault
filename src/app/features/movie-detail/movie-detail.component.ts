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
  template: `
    <div class="detail-container" *ngIf="movie$ | async as movie; else loading">
      <div class="backdrop" [style.backgroundImage]="'url(' + movie.image?.original + ')'"></div>

      <div class="content">
        <div class="poster-side">
          <img [src]="movie.image?.medium" [alt]="movie.name" class="main-poster" />
          <button mat-raised-button color="accent" class="fav-btn" (click)="toggleFavorite(movie)">
            <mat-icon>{{ isFavorite(movie.id) ? 'favorite' : 'favorite_border' }}</mat-icon>
            {{ isFavorite(movie.id) ? 'REMOVE FROM FAVORITES' : 'ADD TO FAVORITES' }}
          </button>
        </div>

        <div class="info-side">
          <div class="header">
            <button mat-icon-button routerLink="/" class="back-btn">
              <mat-icon>arrow_back</mat-icon>
            </button>
            <h1>{{ movie.name }}</h1>
          </div>

          <div class="meta">
            <span class="rating" *ngIf="movie.rating.average">
              <mat-icon>star</mat-icon> {{ movie.rating.average }}
            </span>
            <span class="dot"></span>
            <span>{{ movie.premiered | date: 'yyyy' }}</span>
            <span class="dot"></span>
            <span>{{ movie.runtime }} min</span>
          </div>

          <div class="genres">
            <mat-chip *ngFor="let genre of movie.genres">{{ genre }}</mat-chip>
          </div>

          <div class="summary" [innerHTML]="movie.summary"></div>

          <div class="additional-info">
            <div class="info-item"><strong>Status:</strong> {{ movie.status }}</div>
            <div class="info-item"><strong>Language:</strong> {{ movie.language }}</div>
            <div class="info-item" *ngIf="movie.network">
              <strong>Network:</strong> {{ movie.network.name }} ({{ movie.network.country.code }})
            </div>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loading>
      <div class="loading-container">
        <mat-spinner></mat-spinner>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .detail-container {
        position: relative;
        min-height: calc(100vh - 64px);
        color: #fff;
      }

      .backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        filter: blur(20px) brightness(0.3);
        z-index: -1;
      }

      .content {
        display: flex;
        gap: 3rem;
        padding: 4rem 2rem;
        max-width: 1200px;
        margin: 0 auto;
        flex-wrap: wrap;
      }

      .poster-side {
        flex: 0 0 300px;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .main-poster {
        width: 100%;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      }

      .fav-btn {
        width: 100%;
        height: 48px;
      }

      .info-side {
        flex: 1;
        min-width: 300px;
      }

      .header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .back-btn {
        background: rgba(255, 255, 255, 0.1);
      }

      h1 {
        font-size: 3rem;
        margin: 0;
        font-weight: 800;
      }

      .meta {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
        font-size: 1.1rem;
        color: rgba(255, 255, 255, 0.8);
      }

      .rating {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #ffd700;
      }

      .dot {
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
      }

      .genres {
        display: flex;
        gap: 8px;
        margin-bottom: 2rem;
      }

      .summary {
        font-size: 1.1rem;
        line-height: 1.6;
        margin-bottom: 2rem;
        color: rgba(255, 255, 255, 0.9);
      }

      .additional-info {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
        padding: 1.5rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
      }

      .info-item strong {
        display: block;
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.9rem;
        margin-bottom: 4px;
      }

      .loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 80vh;
      }

      @media (max-width: 768px) {
        .content {
          flex-direction: column;
          align-items: center;
        }
        .info-side {
          text-align: center;
        }
        .header,
        .genres,
        .meta {
          justify-content: center;
        }
      }
    `,
  ],
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
