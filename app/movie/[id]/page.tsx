import { notFound } from "next/navigation";
import { getMovieDetails } from "@/lib/tmdb";
import MovieDetailClient from "@/components/MovieDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailPage({ params }: PageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  if (Number.isNaN(movieId)) notFound();

  let movie;
  try {
    movie = await getMovieDetails(movieId);
  } catch {
    notFound();
  }

  return <MovieDetailClient movie={movie} />;
}
