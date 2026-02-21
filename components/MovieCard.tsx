"use client";

import type { Movie } from "@/types/movie";
import { useTranslation } from "@/contexts/LanguageContext";

const IMAGE_BASE = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE ?? "https://image.tmdb.org/t/p/w500";

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  const { t } = useTranslation();
  const posterUrl = movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : null;
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : "";

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-[160px] md:w-[200px] aspect-[2/3] rounded-md overflow-hidden transition-all duration-300 ease-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-netflix-red focus:ring-offset-2 focus:ring-offset-black"
      style={{ transformOrigin: "center bottom" }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "scale(1.08)";
        el.style.zIndex = "30";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "scale(1)";
        el.style.zIndex = "0";
      }}
    >
      <div className="relative w-full h-full bg-netflix-dark">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <p className="text-white font-bold text-sm truncate mb-1">{movie.title}</p>
          <p className="text-yellow-400 text-xs mb-0.5">⭐ {movie.vote_average.toFixed(1)}/10</p>
          {year && <p className="text-gray-400 text-xs mb-2">{year}</p>}
          <span className="text-netflix-red text-xs font-medium">{t("card.viewDetail")}</span>
        </div>
      </div>
    </button>
  );
}
