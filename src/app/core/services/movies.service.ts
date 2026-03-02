import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Movie, SearchResult } from '../models/movie.model';

@Injectable({
    providedIn: 'root'
})
export class MoviesService {
    private http = inject(HttpClient);
    private readonly baseUrl = 'https://api.tvmaze.com';

    /**
     * Fetch all shows (paginated by API, here we just get the first page for "popular" feel)
     */
    getShows(): Observable<Movie[]> {
        return this.http.get<Movie[]>(`${this.baseUrl}/shows`);
    }

    /**
     * Search for shows by name
     */
    searchShows(query: string): Observable<Movie[]> {
        return this.http.get<SearchResult[]>(`${this.baseUrl}/search/shows?q=${query}`).pipe(
            map(results => results.map(r => r.show))
        );
    }

    /**
     * Get specific show details
     */
    getShowById(id: number): Observable<Movie> {
        return this.http.get<Movie>(`${this.baseUrl}/shows/${id}`);
    }
}
