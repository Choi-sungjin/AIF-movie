"use client";

import Link from "next/link";
import { IMG_BASE } from "@/lib/tmdb";
import type { Movie } from "@/types/movie";
import { useTranslation } from "@/contexts/LanguageContext";

const TITLE_KEYS: Record<string, string> = {
  all: "moviesPage.sectionSf",
  ai: "moviesPage.sectionAi",
  cyberpunk: "moviesPage.sectionCyberpunk",
  space: "moviesPage.sectionSpace",
  dystopia: "moviesPage.sectionDystopia",
};

function MovieGridCard({ movie }: { movie: Movie }) {
  const posterUrl = movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : null;
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : "";

  return (
    <Link
      href={`/movie/${movie.id}`}
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
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
          </svg>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
        <p className="text-white font-semibold text-sm truncate">{movie.title}</p>
        <p className="text-yellow-400 text-xs">⭐ {movie.vote_average.toFixed(1)}</p>
        {year && <p className="text-gray-400 text-xs">{year}</p>}
      </div>
    </Link>
  );
}

interface ResultsItem {
  key: string;
  movies: Movie[] | null;
}

export default function MoviesPageClient({
  results,
  totalCount,
}: {
  results: ResultsItem[];
  totalCount: number;
}) {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {t("moviesPage.title")}
          </h1>
          <span className="px-3 py-1 rounded-full bg-netflix-red text-white text-sm font-medium">
            {totalCount}
            {t("moviesPage.count")}
          </span>
        </div>

        <div className="space-y-12">
          {results.map(({ key, movies }) => (
            <section key={key}>
              <h2 className="text-xl font-bold text-white mb-4">
                {t(TITLE_KEYS[key] ?? key)}
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {(movies ?? []).slice(0, 12).map((movie) => (
                  <div key={movie.id} className="relative">
                    <MovieGridCard movie={movie} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
