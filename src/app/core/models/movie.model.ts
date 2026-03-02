export interface Movie {
    id: number;
    url: string;
    name: string;
    type: string;
    language: string;
    genres: string[];
    status: string;
    runtime: number | null;
    averageRuntime: number | null;
    premiered: string | null;
    ended: string | null;
    officialSite: string | null;
    schedule: {
        time: string;
        days: string[];
    };
    rating: {
        average: number | null;
    };
    weight: number;
    network: {
        id: number;
        name: string;
        country: {
            name: string;
            code: string;
            timezone: string;
        };
        officialSite: string | null;
    } | null;
    webChannel: any | null;
    dvdCountry: any | null;
    externals: {
        tvrage: number | null;
        thetvdb: number | null;
        imdb: string | null;
    };
    image: {
        medium: string;
        original: string;
    } | null;
    summary: string;
    updated: number;
    _links: {
        self: {
            href: string;
        };
        previousepisode?: {
            href: string;
        };
    };
}

export interface SearchResult {
    score: number;
    show: Movie;
}
