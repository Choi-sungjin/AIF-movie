import {
  getAllSciFiMovies,
  getAIRobotMovies,
  getCyberpunkMovies,
  getSpaceAlienMovies,
  getDystopiaMovies,
} from "@/lib/tmdb";
import MoviesPageClient from "@/components/MoviesPageClient";

const CATEGORIES = [
  { key: "all", fetch: getAllSciFiMovies },
  { key: "ai", fetch: getAIRobotMovies },
  { key: "cyberpunk", fetch: getCyberpunkMovies },
  { key: "space", fetch: getSpaceAlienMovies },
  { key: "dystopia", fetch: getDystopiaMovies },
] as const;

export default async function MoviesPage() {
  const results = await Promise.all(
    CATEGORIES.map(async (cat) => ({
      key: cat.key,
      movies: await cat.fetch(),
    }))
  );

  const totalCount = results.reduce((sum, r) => sum + (r.movies?.length ?? 0), 0);

  return (
    <MoviesPageClient
      results={results}
      totalCount={totalCount}
    />
  );
}
