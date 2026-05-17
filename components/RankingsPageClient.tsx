"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IMG_BASE, getTopRatedSciFiMovies } from "@/lib/tmdb";
import type { Movie } from "@/types/movie";
import { useTranslation } from "@/contexts/LanguageContext";

const TOP_N = 20;

export default function RankingsPageClient() {
  const { lang, t } = useTranslation();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getTopRatedSciFiMovies(lang)
      .then((data) => {
        if (!cancelled) setMovies(data.slice(0, TOP_N));
      })
      .catch(() => {
        if (!cancelled) setMovies([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [lang]);

  return (
    <main className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {t("rankingsPage.title")}
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            {t("rankingsPage.subtitle")}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: TOP_N }).map((_, i) => (
              <div
                key={i}
                className="w-full aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((movie, index) => {
              const posterUrl = movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : null;
              const year = movie.release_date
                ? new Date(movie.release_date).getFullYear()
                : "";
              return (
                <Link
                  key={movie.id}
                  href={`/movie/${movie.id}`}
                  className="group relative block w-full aspect-[2/3] rounded-lg overflow-hidden bg-netflix-dark transition-transform duration-300 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-netflix-red focus:ring-offset-2 focus:ring-offset-black"
                >
                  <div className="absolute top-0 left-0 z-10 bg-gradient-to-br from-netflix-red to-red-900 text-white font-bold text-lg md:text-xl w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-br-lg shadow-lg">
                    {index + 1}
                    <span className="text-[10px] ml-0.5 opacity-80">
                      {t("rankingsPage.rankSuffix")}
                    </span>
                  </div>
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
                    <p className="text-yellow-400 text-xs">
                      ⭐ {movie.vote_average.toFixed(1)}
                    </p>
                    {year && <p className="text-gray-400 text-xs">{year}</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
