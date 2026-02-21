"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/contexts/LanguageContext";

const LANGUAGES = ["Kr", "En", "Jp"] as const;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, setLang, t } = useTranslation();

  const navItems = [
    { labelKey: "nav.home", href: "/" },
    { labelKey: "nav.movies", href: "/movies" },
    { labelKey: "nav.series", href: "/series" },
    { labelKey: "nav.myList", href: "/mylist" },
  ] as const;

  const setLanguage = (value: (typeof LANGUAGES)[number]) => {
    setLang(value);
  };

  const navLinkClass =
    "text-gray-300 hover:text-white text-sm font-medium transition-colors duration-200 w-24 text-center whitespace-nowrap";

  const langButtonClass = (value: (typeof LANGUAGES)[number]) =>
    `w-9 py-1.5 rounded text-xs font-medium transition-colors flex-shrink-0 ${
      lang === value
        ? "bg-netflix-red text-white"
        : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-netflix-red font-bold text-xl md:text-2xl tracking-tight hover:opacity-90 transition-opacity"
          >
            FUTURE CINEMA
          </Link>

          <div className="flex items-center gap-6 shrink-0">
            {/* 언어 선택: 고정 너비로 언어 변경 시 위치 유지 */}
            <div className="hidden md:flex items-center gap-0.5 rounded-lg bg-gray-800/80 p-0.5 w-[7.25rem]">
              {LANGUAGES.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setLanguage(value)}
                  className={langButtonClass(value)}
                  aria-label={`${t("nav.ariaLang")}: ${value}`}
                >
                  {value}
                </button>
              ))}
            </div>

            {/* 네비 링크: 항목별 고정 너비로 텍스트 길이와 관계없이 위치 유지 */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.labelKey}
                  href={item.href}
                  className={navLinkClass}
                >
                  {t(item.labelKey)}
                </Link>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={t("nav.menuOpen")}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 animate-fadeIn">
            <div className="flex items-center gap-1 mb-4">
              <span className="text-gray-500 text-xs w-12 shrink-0">{t("nav.language")}</span>
              <div className="flex gap-0.5 w-[7.25rem]">
                {LANGUAGES.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setLanguage(value)}
                    className={langButtonClass(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.labelKey}
                  href={item.href}
                  className={`${navLinkClass} py-2 px-3 rounded-lg hover:bg-white/10 block text-left w-full min-w-0`}
                  onClick={() => setMenuOpen(false)}
                >
                  {t(item.labelKey)}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
