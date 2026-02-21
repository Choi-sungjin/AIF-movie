"use client";

import Link from "next/link";
import { useTranslation } from "@/contexts/LanguageContext";

export default function SeriesPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4 pt-16">
      <p className="text-gray-400 text-lg md:text-xl text-center mb-8">
        {t("seriesPage.message")}
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
        {t("seriesPage.backHome")}
      </Link>
    </main>
  );
}
