"use client";

import { useRef } from "react";
import type { Movie } from "@/types/movie";
import MovieCard from "./MovieCard";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movieId: number) => void;
}

export default function MovieRow({ title, movies, onMovieClick }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (!movies?.length) return null;

  return (
    <section className="mb-10 group/row">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 px-4 md:px-12">
        {title}
      </h2>
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth px-4 md:px-12 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-shrink-0 movie-card-wrapper"
              style={{ padding: "12px 4px" }}
            >
              <MovieCard
                movie={movie}
                onClick={() => onMovieClick(movie.id)}
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 text-white opacity-0 group-hover/row:opacity-100 hover:bg-netflix-red transition-all flex items-center justify-center z-10"
          aria-label="왼쪽으로 스크롤"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 text-white opacity-0 group-hover/row:opacity-100 hover:bg-netflix-red transition-all flex items-center justify-center z-10"
          aria-label="오른쪽으로 스크롤"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </button>
      </div>
    </section>
  );
}
