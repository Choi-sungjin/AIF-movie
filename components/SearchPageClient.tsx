"use client";

import { useEffect, useState } from "react";
import { IMG_BASE, searchMovies } from "@/lib/tmdb";
import type { Movie } from "@/types/movie";
import { useTranslation } from "@/contexts/LanguageContext";
import MovieModal from "./MovieModal";

const DEBOUNCE_MS = 400;

export default function SearchPageClient() {
  const { lang, t } = useTranslation();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  useEffect(() => {
    const tid = window.setTimeout(() => setDebouncedQuery(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(tid);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setHasSearched(true);
    searchMovies(debouncedQuery, lang)
      .then((data) => {
        if (!cancelled) setResults(data);
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, lang]);

  return (
    <main className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
          {t("searchPage.title")}
        </h1>

        <div className="relative mb-10">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPage.placeholder")}
            className="w-full bg-gray-900 border border-gray-700 focus:border-netflix-red rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-500 outline-none transition-colors"
            autoFocus
          />
          <svg
            className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {!hasSearched ? (
          <p className="text-gray-400 text-center py-20">{t("searchPage.prompt")}</p>
        ) : loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-full aspect-[2/3] bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <p className="text-gray-400 text-center py-20">{t("searchPage.noResults")}</p>
        ) : (
          <>
            <p className="text-gray-400 text-sm mb-4">
              {results.length}
              {t("searchPage.resultsCount")}
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {results.map((movie) => {
                const posterUrl = movie.poster_path
                  ? `${IMG_BASE}${movie.poster_path}`
                  : null;
                const year = movie.release_date
                  ? new Date(movie.release_date).getFullYear()
                  : "";
                return (
                  <button
                    key={movie.id}
                    type="button"
                    onClick={() => setSelectedMovieId(movie.id)}
                    className="group relative block w-full aspect-[2/3] rounded-lg overflow-hidden bg-netflix-dark transition-transform duration-300 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-netflix-red focus:ring-offset-2 focus:ring-offset-black"
                  >
                    {posterUrl ? (
                      <img
                        src={posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-900">
                        <span className="text-xs">No image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                      <p className="text-white font-semibold text-sm truncate">
                        {movie.title}
                      </p>
                      {typeof movie.vote_average === "number" && (
                        <p className="text-yellow-400 text-xs">
                          ⭐ {movie.vote_average.toFixed(1)}
                        </p>
                      )}
                      {year && <p className="text-gray-400 text-xs">{year}</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {selectedMovieId !== null && (
        <MovieModal
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
          onSelectMovie={setSelectedMovieId}
        />
      )}
    </main>
  );
}
