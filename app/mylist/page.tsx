"use client";

import Link from "next/link";
import { useTranslation } from "@/contexts/LanguageContext";

export default function MyListPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4 pt-16">
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-800/80 flex items-center justify-center mb-6">
        <svg
          className="w-12 h-12 md:w-16 md:h-16 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </div>
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">
        {t("mylistPage.title")}
      </h2>
      <p className="text-gray-400 text-center mb-8 max-w-sm">
        {t("mylistPage.description")}
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-netflix-red text-white font-medium hover:opacity-90 transition-opacity"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
        {t("mylistPage.backHome")}
      </Link>
    </main>
  );
}
