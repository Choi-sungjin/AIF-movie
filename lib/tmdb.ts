import type { Movie, MovieDetails } from "@/types/movie";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const IMG_BASE = "https://image.tmdb.org/t/p/w500";
export const BACKDROP_BASE = "https://image.tmdb.org/t/p/original";

/** TMDB API language (Kr/En/Jp → locale). Use for ALL endpoints. */
export const LANG_LOCALE: Record<string, string> = {
  Kr: "ko-KR",
  En: "en-US",
  Jp: "ja-JP",
};

/** Region: ONLY for now_playing, upcoming, top_rated. Never mix KR region with En language. */
export const LANG_REGION: Record<string, string> = {
  Kr: "KR",
  En: "US",
  Jp: "JP",
};

// Revalidate (seconds) — used when called from server
const REVALIDATE = {
  TRENDING_WEEK: 86400,
  NOW_PLAYING: 43200,
  DISCOVER: 3600,
  MOVIE_DETAIL: 604800,
} as const;

const QUALITY_PARAMS =
  "include_adult=false&vote_count.gte=100&vote_average.gte=5.0&without_genres=99";

interface DiscoverResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
}

async function fetchMovies(url: string, revalidate?: number): Promise<Movie[]> {
  const res = await fetch(url, {
    next: revalidate ? { revalidate } : undefined,
  });
  if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
  const data: DiscoverResponse = await res.json();
  return data.results ?? [];
}

/** 주간 트렌딩 (히어로용). trending does NOT use region. */
export async function getTrendingMoviesWeek(lang: string = "En"): Promise<Movie[]> {
  const locale = LANG_LOCALE[lang] ?? "en-US";
  const url = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=${locale}`;
  return fetchMovies(url, REVALIDATE.TRENDING_WEEK);
}

/** 현재 상영 중. language + region must match (e.g. En → en-US + US). */
export async function getNowPlayingMovies(lang: string = "En"): Promise<Movie[]> {
  const locale = LANG_LOCALE[lang] ?? "en-US";
  const region = LANG_REGION[lang] ?? "US";
  const url = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=${locale}&region=${region}&page=1`;
  const res = await fetch(url, { next: { revalidate: REVALIDATE.NOW_PLAYING } });
  if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
  const data: DiscoverResponse = await res.json();
  return data.results ?? [];
}

/** discover/movie does NOT use region — only language. */
export async function getAllSciFiMovies(lang: string = "En"): Promise<Movie[]> {
  const locale = LANG_LOCALE[lang] ?? "en-US";
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=${locale}&with_genres=878&sort_by=popularity.desc&vote_count.gte=200&${QUALITY_PARAMS}&page=1`;
  return fetchMovies(url, REVALIDATE.DISCOVER);
}

export async function getAIRobotMovies(lang: string = "En"): Promise<Movie[]> {
  const locale = LANG_LOCALE[lang] ?? "en-US";
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=${locale}&with_keywords=362282|803|14544|1373|220903&with_genres=878&sort_by=vote_average.desc&vote_count.gte=100&${QUALITY_PARAMS}&page=1`;
  return fetchMovies(url, REVALIDATE.DISCOVER);
}

export async function getCyberpunkMovies(lang: string = "En"): Promise<Movie[]> {
  const locale = LANG_LOCALE[lang] ?? "en-US";
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=${locale}&with_keywords=12190&sort_by=popularity.desc&vote_count.gte=50&${QUALITY_PARAMS}&page=1`;
  return fetchMovies(url, REVALIDATE.DISCOVER);
}

export async function getSpaceAlienMovies(lang: string = "En"): Promise<Movie[]> {
  const locale = LANG_LOCALE[lang] ?? "en-US";
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=${locale}&with_keywords=9951|9882|3801&with_genres=878&sort_by=popularity.desc&vote_count.gte=200&${QUALITY_PARAMS}&page=1`;
  return fetchMovies(url, REVALIDATE.DISCOVER);
}

export async function getDystopiaMovies(lang: string = "En"): Promise<Movie[]> {
  const locale = LANG_LOCALE[lang] ?? "en-US";
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=${locale}&with_keywords=4565|4458|350338&sort_by=popularity.desc&vote_count.gte=100&${QUALITY_PARAMS}&page=1`;
  return fetchMovies(url, REVALIDATE.DISCOVER);
}

const APPEND_RESPONSE = "credits,videos,similar,images";

export async function getMovieDetails(
  id: number,
  lang: string = "En"
): Promise<MovieDetails> {
  const locale = LANG_LOCALE[lang] ?? "en-US";

  const res = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=${locale}&append_to_response=${APPEND_RESPONSE}`,
    { next: { revalidate: REVALIDATE.MOVIE_DETAIL } }
  );
  if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
  const data: MovieDetails = await res.json();

  if (!data.overview?.trim() && lang !== "En") {
    const fallbackRes = await fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=${APPEND_RESPONSE}`
    );
    if (fallbackRes.ok) {
      const fallbackData: MovieDetails = await fallbackRes.json();
      return { ...data, overview: fallbackData.overview ?? data.overview };
    }
  }

  return data;
}

interface VideosResponse {
  results?: { key: string; type: string; site: string }[];
}

/** 트레일러 YouTube key 조회 (Trailer → Teaser → any YouTube). 언어 fallback 지원. */
export async function getMovieTrailerKey(
  movieId: number,
  lang: string = "En"
): Promise<string | null> {
  const locale = LANG_LOCALE[lang] ?? "en-US";

  const findVideo = (results: { key: string; type: string; site: string }[] = []) =>
    results.find((v) => v.type === "Trailer" && v.site === "YouTube") ??
    results.find((v) => v.type === "Teaser" && v.site === "YouTube") ??
    results.find((v) => v.site === "YouTube") ??
    null;

  try {
    const res = await fetch(
      `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=${locale}`
    );
    const data: VideosResponse = await res.json();
    let video = findVideo(data.results ?? []);

    if (!video && lang !== "En") {
      const fallbackRes = await fetch(
        `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
      );
      const fallbackData: VideosResponse = await fallbackRes.json();
      video = findVideo(fallbackData.results ?? []);
    }

    return video?.key ?? null;
  } catch {
    return null;
  }
}
