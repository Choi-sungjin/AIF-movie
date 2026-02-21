"use client";

import { useEffect } from "react";
import { useTranslation } from "@/contexts/LanguageContext";
import { useScrollLock } from "@/hooks/useScrollLock";

interface TrailerModalProps {
  videoKey: string | null;
  movieTitle: string;
  onClose: () => void;
}

export default function TrailerModal({ videoKey, movieTitle, onClose }: TrailerModalProps) {
  const { t } = useTranslation();

  useScrollLock(!!videoKey);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!videoKey) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t("modal.trailer")}
    >
      <div
        className="relative w-full max-w-5xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[#E50914] text-xl flex-shrink-0">▶</span>
            <h2 className="text-white font-bold text-lg truncate">{movieTitle}</h2>
            <span className="text-gray-400 text-sm flex-shrink-0 ml-2">
              — {t("trailer.official")}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors bg-gray-800 hover:bg-gray-700 rounded-full w-9 h-9 flex items-center justify-center text-lg flex-shrink-0"
            aria-label={t("modal.close")}
          >
            ✕
          </button>
        </div>

        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          <iframe
            className="absolute inset-0 w-full h-full rounded-lg"
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3`}
            title={`${movieTitle} ${t("modal.trailer")}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        <p className="text-center text-gray-600 text-xs mt-3">
          {t("trailer.closeHint")}
        </p>
      </div>
    </div>
  );
}
