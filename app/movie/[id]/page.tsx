"use client";

import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "@/contexts/LanguageContext";
import { getMovieDetails } from "@/lib/tmdb";
import MovieDetailClient from "@/components/MovieDetailClient";
import type { MovieDetails } from "@/types/movie";

export default function MovieDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const { lang } = useTranslation();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const movieId = id != null ? parseInt(id, 10) : NaN;

  useEffect(() => {
    if (Number.isNaN(movieId)) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getMovieDetails(movieId, lang)
      .then(setMovie)
      .catch(() => setMovie(null))
      .finally(() => setLoading(false));
  }, [movieId, lang]);

  if (id !== undefined && Number.isNaN(movieId)) notFound();
  if (!loading && !movie && id) notFound();

  if (loading) {
    return (
      <main className="min-h-screen bg-black">
        <div className="h-[60vh] bg-gray-900 animate-pulse" />
        <div className="max-w-4xl mx-auto px-4 md:px-12 pt-8 pb-16">
          <div className="h-8 w-64 bg-gray-800 rounded animate-pulse mb-6" />
          <div className="h-8 w-64 bg-gray-800 rounded animate-pulse mb-4" />
          <div className="flex gap-3 mb-4">
            <div className="h-5 w-12 bg-gray-800 rounded animate-pulse" />
            <div className="h-5 w-14 bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="flex gap-2 mb-6">
            <div className="h-8 w-20 bg-gray-800 rounded-full animate-pulse" />
            <div className="h-8 w-24 bg-gray-800 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 md:px-12 py-8">
          <div className="h-4 w-full bg-gray-800 rounded animate-pulse mb-2" />
          <div className="h-4 w-full bg-gray-800 rounded animate-pulse mb-2" />
          <div className="h-4 w-3/4 bg-gray-800 rounded animate-pulse mb-10" />
          <div className="h-6 w-28 bg-gray-800 rounded animate-pulse mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gray-800 animate-pulse mb-2" />
                <div className="h-4 w-16 bg-gray-800 rounded animate-pulse" />
                <div className="h-3 w-12 bg-gray-800 rounded animate-pulse mt-1" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!movie) return null;

  return <MovieDetailClient movie={movie} />;
}
