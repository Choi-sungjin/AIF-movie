export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
  };
  videos?: {
    results: {
      key: string;
      type: string;
      site: string;
      name?: string;
    }[];
  };
  similar?: {
    results: Movie[];
  };
}

export interface TMDBResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
}
