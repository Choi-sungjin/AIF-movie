"use client";

import { useEffect, useState } from "react";
import { getMovieDetails, BACKDROP_BASE, IMG_BASE } from "@/lib/tmdb";
import type { MovieDetails as MovieDetailsType } from "@/types/movie";
import { useTranslation } from "@/contexts/LanguageContext";
import { useScrollLock } from "@/hooks/useScrollLock";

interface MovieModalProps {
  movieId: number | null;
  onClose: () => void;
  onSelectMovie?: (id: number) => void;
}

export default function MovieModal({ movieId, onClose, onSelectMovie }: MovieModalProps) {
  const { lang, t } = useTranslation();
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useScrollLock(!!movieId);

  useEffect(() => {
    if (!movieId) {
      setMovie(null);
      setShowTrailer(false);
      return;
    }
    setLoading(true);
    setMovie(null);
    setError(null);
    setShowTrailer(false);
    getMovieDetails(movieId, lang)
      .then(setMovie)
      .catch(() => setError("loadFailed"))
      .finally(() => setLoading(false));
  }, [movieId, lang]);

  if (movieId === null) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const cast = movie?.credits?.cast?.slice(0, 5) ?? [];
  const profileBase = "https://image.tmdb.org/t/p/w185";
  const trailer = movie?.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );
  const similarMovies = movie?.similar?.results?.filter((m) => m.poster_path)?.slice(0, 6) ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-fadeIn"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative bg-netflix-dark rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/70 text-white hover:bg-netflix-red transition-colors flex items-center justify-center"
          aria-label={t("modal.close")}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {loading && (
          <div className="animate-pulse">
            <div className="h-64 bg-gray-700 rounded-t-lg" />
            <div className="p-6 md:p-8">
              <div className="h-8 bg-gray-700 rounded w-1/2 mb-4" />
              <div className="h-4 bg-gray-700 rounded w-full mb-2" />
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-6" />
              <div className="flex gap-2">
                <div className="h-6 bg-gray-700 rounded-full w-16" />
                <div className="h-6 bg-gray-700 rounded-full w-20" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-8 text-center text-red-400">
            {t("error.loadFailedEn")}
          </div>
        )}

        {movie && !loading && (
          <>
            <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-black">
              {showTrailer && trailer ? (
                <iframe
                  title={t("modal.trailer")}
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  {movie.backdrop_path ? (
                    <img
                      src={`${BACKDROP_BASE}${movie.backdrop_path}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark to-transparent" />
                  {trailer && (
                    <button
                      type="button"
                      onClick={() => setShowTrailer(true)}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-16 h-16 rounded-full bg-netflix-red hover:bg-red-600 transition-colors text-white shadow-lg"
                      aria-label={t("modal.trailer")}
                    >
                      <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="p-6 md:p-8">
              <h2 id="modal-title" className="text-2xl font-bold text-white mb-4">
                {movie.title}
              </h2>

              <div className="flex flex-wrap gap-2 mb-4">
                {movie.release_date && (
                  <span className="px-3 py-1 rounded-full bg-white/10 text-gray-300 text-sm">
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                )}
                {movie.runtime > 0 && (
                  <span className="px-3 py-1 rounded-full bg-white/10 text-gray-300 text-sm">
                    {movie.runtime}{t("modal.runtimeMin")}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm">
                  ⭐ {movie.vote_average.toFixed(1)}
                </span>
              </div>

              <p className="text-gray-400 leading-relaxed mb-6">
                {movie.overview || t("common.noOverview")}
              </p>

              {movie.genres?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {t("modal.genres")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((g) => (
                      <span
                        key={g.id}
                        className="px-3 py-1 rounded-full bg-gray-700 text-gray-300 text-sm"
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {cast.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {t("modal.cast")}
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {cast.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center gap-2 flex-shrink-0"
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                          {c.profile_path ? (
                            <img
                              src={`${profileBase}${c.profile_path}`}
                              alt={c.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg">
                              ?
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium text-sm truncate max-w-[120px]">
                            {c.name}
                          </p>
                          <p className="text-gray-500 text-xs truncate max-w-[120px]">
                            {c.character}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {similarMovies.length > 0 && onSelectMovie && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {t("modal.similar")}
                  </h3>
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1">
                    {similarMovies.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => onSelectMovie(m.id)}
                        className="flex-shrink-0 w-20 aspect-[2/3] rounded-md overflow-hidden bg-gray-800 focus:ring-2 focus:ring-netflix-red focus:ring-offset-2 focus:ring-offset-netflix-dark"
                      >
                        <img
                          src={`${IMG_BASE}${m.poster_path}`}
                          alt={m.title}
                          className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
