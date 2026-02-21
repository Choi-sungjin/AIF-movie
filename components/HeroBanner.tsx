"use client";

import type { Movie } from "@/types/movie";
import Link from "next/link";
import { BACKDROP_BASE } from "@/lib/tmdb";
import { useTranslation } from "@/contexts/LanguageContext";

interface HeroBannerProps {
  movie: Movie;
  trailerKey?: string | null;
  onPlayClick?: () => void;
  onMoreInfo?: () => void;
}

export default function HeroBanner({ movie, trailerKey = null, onPlayClick, onMoreInfo }: HeroBannerProps) {
  const { t } = useTranslation();
  const IMAGE_BASE = BACKDROP_BASE;
  const backdropUrl = movie.backdrop_path
    ? `${IMAGE_BASE}${movie.backdrop_path}`
    : "";
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : "";
  const yearSuffix = t("hero.year");
  const hasTrailer = !!trailerKey;
  const canPlay = onPlayClick && hasTrailer;

  return (
    <section
      className="relative min-h-[85vh] flex items-end pb-24 md:pb-32 px-4 md:px-12 animate-fadeIn"
      style={{
        backgroundImage: backdropUrl
          ? `linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%), linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 50%), url(${backdropUrl})`
          : "linear-gradient(to right, #141414, #333)",
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
    >
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-4">
          {movie.title}
        </h1>
        <p className="text-gray-300 text-base md:text-lg line-clamp-2 mb-4 max-w-xl">
          {movie.overview || t("common.noOverview")}
        </p>
        <div className="flex items-center gap-4 mb-6">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 text-yellow-400 text-sm font-medium">
            <span aria-hidden>⭐</span>
            {movie.vote_average.toFixed(1)}
          </span>
          {year && yearSuffix && (
            <span className="text-gray-400 text-sm">{year}{yearSuffix}</span>
          )}
          {year && !yearSuffix && (
            <span className="text-gray-400 text-sm">{year}</span>
          )}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {onPlayClick ? (
            <button
              type="button"
              onClick={onPlayClick}
              disabled={!hasTrailer}
              title={!hasTrailer ? t("hero.trailerUnavailable") : undefined}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded font-semibold transition-colors ${
                canPlay
                  ? "bg-white text-black hover:bg-gray-200 cursor-pointer"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed opacity-60"
              }`}
            >
              <span aria-hidden>▶</span>
              {t("hero.playNow")}
              {hasTrailer && (
                <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#E50914] text-white uppercase tracking-wide">
                  {t("modal.trailer")}
                </span>
              )}
            </button>
          ) : (
            <Link
              href={`/movie/${movie.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded bg-white text-black font-semibold hover:bg-gray-200 transition-colors"
            >
              <span aria-hidden>▶</span>
              {t("hero.playNow")}
            </Link>
          )}
          {onMoreInfo ? (
            <button
              type="button"
              onClick={onMoreInfo}
              className="inline-flex items-center gap-2 px-6 py-3 rounded bg-gray-500/70 text-white font-medium hover:bg-gray-500/90 transition-colors"
            >
              <span aria-hidden>ℹ</span>
              {t("hero.moreInfo")}
            </button>
          ) : (
            <Link
              href={`/movie/${movie.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded bg-gray-500/70 text-white font-medium hover:bg-gray-500/90 transition-colors"
            >
              <span aria-hidden>ℹ</span>
              {t("hero.moreInfo")}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
