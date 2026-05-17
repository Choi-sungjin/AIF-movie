"use client";

import { useEffect, useMemo, useState } from "react";
import { IMG_BASE, getUpcomingMovies } from "@/lib/tmdb";
import type { Movie } from "@/types/movie";
import { useTranslation } from "@/contexts/LanguageContext";
import MovieModal from "./MovieModal";

const DATE_LOCALE: Record<string, string> = {
  Kr: "ko-KR",
  En: "en-US",
  Jp: "ja-JP",
};

function formatReleaseDate(iso: string | undefined, lang: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(DATE_LOCALE[lang] ?? "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function UpcomingPageClient() {
  const { lang, t } = useTranslation();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getUpcomingMovies(lang)
      .then((data) => {
        if (!cancelled) setMovies(data);
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

  const sortedMovies = useMemo(() => {
    return [...movies].sort((a, b) => {
      const ta = a.release_date ? new Date(a.release_date).getTime() : Infinity;
      const tb = b.release_date ? new Date(b.release_date).getTime() : Infinity;
      return ta - tb;
    });
  }, [movies]);

  return (
    <main className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {t("upcomingPage.title")}
          </h1>
          {!loading && (
            <span className="px-3 py-1 rounded-full bg-netflix-red text-white text-sm font-medium">
              {sortedMovies.length}
              {t("upcomingPage.count")}
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="w-full aspect-[2/3] bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : sortedMovies.length === 0 ? (
          <p className="text-gray-400 text-center py-20">{t("upcomingPage.empty")}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {sortedMovies.map((movie) => {
              const posterUrl = movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : null;
              const releaseText = formatReleaseDate(movie.release_date, lang);
              return (
                <button
                  key={movie.id}
                  type="button"
                  onClick={() => setSelectedMovieId(movie.id)}
                  className="group block text-left w-full rounded-lg overflow-hidden bg-netflix-dark transition-transform duration-300 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-netflix-red focus:ring-offset-2 focus:ring-offset-black"
                >
                  <div className="relative w-full aspect-[2/3] bg-gray-900">
                    {posterUrl ? (
                      <img
                        src={posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <span className="text-xs">No image</span>
                      </div>
                    )}
                    {releaseText && (
                      <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-white text-[10px] md:text-xs px-2 py-1 rounded-md font-medium">
                        {releaseText}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-white font-semibold text-sm truncate group-hover:text-netflix-red transition-colors">
                      {movie.title}
                    </p>
                    {releaseText && (
                      <p className="text-gray-400 text-xs mt-1">
                        {t("upcomingPage.releaseDate")}: {releaseText}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
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
