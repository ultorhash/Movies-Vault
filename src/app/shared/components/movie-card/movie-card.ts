import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { Movie } from '../../../core/models/movie.model';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    RouterLink,
  ],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.scss',
})
export class MovieCardComponent {
  @Input({ required: true }) movie!: Movie;
  @Input() isFavorite = false;

  @Output() toggleFavorite = new EventEmitter<Movie>();

  onToggleFavorite(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.toggleFavorite.emit(this.movie);
  }
}
