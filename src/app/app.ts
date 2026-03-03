import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { selectFavorites, selectIsDarkMode } from './store/movies.selectors';
import { MoviesActions } from './store/movies.actions';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {
  private store = inject(Store);

  favoritesCount$ = this.store.select(selectFavorites).pipe(map((favs) => favs.length));

  lastScrollTop = 0;
  isHeaderHidden = false;
  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const st = window.pageYOffset || document.documentElement.scrollTop;

    if (st <= 0) {
      this.isHeaderHidden = false;
      this.isScrolled = false;
    } else if (st > this.lastScrollTop && st > 80) {
      this.isHeaderHidden = true;
      this.isScrolled = true;
    } else if (st < this.lastScrollTop) {
      this.isHeaderHidden = false;
    }

    this.lastScrollTop = st <= 0 ? 0 : st;
  }

  isDarkMode$ = this.store.select(selectIsDarkMode).pipe(
    tap((isDark) => {
      if (isDark) {
        document.body.classList.remove('light-theme');
      } else {
        document.body.classList.add('light-theme');
      }
    })
  );

  toggleTheme() {
    this.store.dispatch(MoviesActions.toggleTheme());
  }
}
