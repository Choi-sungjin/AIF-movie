"use client";

import Link from "next/link";
import { useTranslation } from "@/contexts/LanguageContext";
import { BACKDROP_BASE } from "@/lib/tmdb";
import type { MovieDetails } from "@/types/movie";

const PROFILE_BASE = "https://image.tmdb.org/t/p/w185";

interface Props {
  movie: MovieDetails;
}

export default function MovieDetailClient({ movie }: Props) {
  const { t } = useTranslation();
  const cast = movie.credits?.cast?.slice(0, 10) ?? [];
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : "";

  return (
    <main className="min-h-screen bg-black">
      <div className="relative min-h-[60vh]">
        {movie.backdrop_path && (
          <>
            <img
              src={`${BACKDROP_BASE}${movie.backdrop_path}`}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          </>
        )}
        <div className="relative max-w-4xl mx-auto px-4 md:px-12 pt-32 pb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            {t("movieDetail.backToList")}
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {movie.title}
          </h1>
          <div className="flex flex-wrap gap-3 text-gray-400 mb-4">
            {year && <span>{year}</span>}
            {movie.runtime > 0 && (
              <span>
                {movie.runtime}
                {t("movieDetail.runtimeMin")}
              </span>
            )}
            <span className="text-yellow-400">⭐ {movie.vote_average.toFixed(1)}</span>
          </div>
          {movie.genres?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map((g) => (
                <span
                  key={g.id}
                  className="px-3 py-1 rounded-full bg-gray-700 text-gray-300 text-sm"
                >
                  {g.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-12 py-12">
        <p className="text-gray-300 leading-relaxed text-lg mb-10">
          {movie.overview || t("common.noOverview")}
        </p>

        {cast.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white mb-4">
              {t("movieDetail.cast")}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {cast.map((c) => (
                <div key={c.id} className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-800 mb-2">
                    {c.profile_path ? (
                      <img
                        src={`${PROFILE_BASE}${c.profile_path}`}
                        alt={c.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl">
                        ?
                      </div>
                    )}
                  </div>
                  <p className="text-white font-medium text-sm truncate">{c.name}</p>
                  <p className="text-gray-500 text-xs truncate">{c.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
