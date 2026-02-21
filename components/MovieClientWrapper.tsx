"use client";

import { useState, useEffect } from "react";
import type { Movie } from "@/types/movie";
import { useTranslation } from "@/contexts/LanguageContext";
import {
  getTrendingMoviesWeek,
  getNowPlayingMovies,
  getAllSciFiMovies,
  getAIRobotMovies,
  getCyberpunkMovies,
  getSpaceAlienMovies,
  getDystopiaMovies,
  getMovieTrailerKey,
} from "@/lib/tmdb";
import HeroBanner from "./HeroBanner";
import MovieRow from "./MovieRow";
import MovieModal from "./MovieModal";
import TrailerModal from "./TrailerModal";

type CategoryKey = "all" | "aiRobot" | "cyberpunk" | "space" | "dystopia";

const CATEGORY_KEYS: CategoryKey[] = ["all", "aiRobot", "cyberpunk", "space", "dystopia"];

const initialMovies = {
  trending: [] as Movie[],
  all: [] as Movie[],
  ai: [] as Movie[],
  cyberpunk: [] as Movie[],
  space: [] as Movie[],
  dystopia: [] as Movie[],
  nowPlaying: [] as Movie[],
};

export default function MovieClientWrapper() {
  const { lang, t } = useTranslation();
  const [movies, setMovies] = useState(initialMovies);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [trailerTitle, setTrailerTitle] = useState("");
  const [trailerLoading, setTrailerLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [heroTrailerKey, setHeroTrailerKey] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getTrendingMoviesWeek(lang),
      getAllSciFiMovies(lang),
      getAIRobotMovies(lang),
      getCyberpunkMovies(lang),
      getSpaceAlienMovies(lang),
      getDystopiaMovies(lang),
      getNowPlayingMovies(lang),
    ])
      .then(([trending, all, ai, cyberpunk, space, dystopia, nowPlaying]) => {
        setMovies({
          trending: trending ?? [],
          all: all ?? [],
          ai: ai ?? [],
          cyberpunk: cyberpunk ?? [],
          space: space ?? [],
          dystopia: dystopia ?? [],
          nowPlaying: nowPlaying ?? [],
        });
      })
      .catch(() => setMovies(initialMovies))
      .finally(() => setLoading(false));
  }, [lang]);

  const getFilteredRows = (): { title: string; movies: Movie[] }[] => {
    switch (activeCategory) {
      case "aiRobot":
        return [{ title: t("categories.sectionAi"), movies: movies.ai }];
      case "cyberpunk":
        return [{ title: t("categories.sectionCyberpunkShort"), movies: movies.cyberpunk }];
      case "space":
        return [{ title: t("categories.sectionSpaceShort"), movies: movies.space }];
      case "dystopia":
        return [{ title: t("categories.sectionDystopiaShort"), movies: movies.dystopia }];
      default:
        return [
          { title: t("categories.sectionNowPlaying"), movies: movies.nowPlaying },
          { title: t("categories.sectionAi"), movies: movies.ai },
          { title: t("categories.sectionSf"), movies: movies.all },
          { title: t("categories.sectionCyberpunk"), movies: movies.cyberpunk },
          { title: t("categories.sectionSpace"), movies: movies.space },
          { title: t("categories.sectionDystopia"), movies: movies.dystopia },
        ];
    }
  };

  const heroMovie = movies.trending[0] ?? movies.all[0];

  useEffect(() => {
    if (!heroMovie) {
      setHeroTrailerKey(null);
      return;
    }
    let cancelled = false;
    getMovieTrailerKey(heroMovie.id, lang).then((key) => {
      if (!cancelled) setHeroTrailerKey(key);
    });
    return () => {
      cancelled = true;
    };
  }, [heroMovie?.id, lang]);

  const handlePlayTrailer = async (movie: Movie) => {
    if (movie.id === heroMovie?.id && heroTrailerKey) {
      setTrailerTitle(movie.title);
      setTrailerKey(heroTrailerKey);
      return;
    }
    setTrailerLoading(true);
    setTrailerTitle(movie.title);
    setTrailerKey(null);
    const key = await getMovieTrailerKey(movie.id, lang);
    setTrailerKey(key ?? null);
    setTrailerLoading(false);
    if (!key) setToastMessage(t("trailer.notFound"));
  };

  useEffect(() => {
    if (!toastMessage) return;
    const tid = window.setTimeout(() => setToastMessage(null), 2000);
    return () => clearTimeout(tid);
  }, [toastMessage]);

  if (loading) {
    return (
      <div className="bg-black min-h-screen">
        <div className="h-[85vh] bg-gray-900 animate-pulse rounded-b-lg" />
        <div className="px-4 md:px-12 py-8 space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-6 w-48 bg-gray-800 rounded mb-4 animate-pulse" />
              <div className="flex gap-3 overflow-hidden">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div
                    key={j}
                    className="w-[160px] md:w-[200px] aspect-[2/3] bg-gray-800 rounded-md animate-pulse flex-shrink-0"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!heroMovie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p>{t("error.loadFailed")}</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      {trailerLoading && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin" />
            <p className="text-white text-sm">{t("trailer.loading")}</p>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[101] px-4 py-2 rounded-lg bg-gray-800 text-white text-sm shadow-lg animate-fadeIn">
          {toastMessage}
        </div>
      )}

      <HeroBanner
        movie={heroMovie}
        trailerKey={heroTrailerKey}
        onPlayClick={() => handlePlayTrailer(heroMovie)}
        onMoreInfo={() => setSelectedMovieId(heroMovie.id)}
      />

      <div id="movies-section" className="sticky top-16 z-40 bg-black/80 backdrop-blur-sm px-4 md:px-12 py-3 flex gap-3 overflow-x-auto scrollbar-hide border-b border-gray-800">
        {CATEGORY_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveCategory(key)}
            className={`
              whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
              ${activeCategory === key
                ? "bg-[#E50914] text-white scale-105 shadow-lg shadow-red-900/50"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
              }
            `}
          >
            {t(`categories.${key}`)}
          </button>
        ))}
      </div>

      <div className="pb-20 space-y-8 mt-8">
        {getFilteredRows().map((row) => (
          <MovieRow
            key={row.title}
            title={row.title}
            movies={row.movies}
            onMovieClick={setSelectedMovieId}
          />
        ))}
      </div>

      {selectedMovieId !== null && (
        <MovieModal
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
          onSelectMovie={setSelectedMovieId}
        />
      )}

      {trailerKey && (
        <TrailerModal
          videoKey={trailerKey}
          movieTitle={trailerTitle}
          onClose={() => {
            setTrailerKey(null);
            setTrailerTitle("");
          }}
        />
      )}
    </div>
  );
}
