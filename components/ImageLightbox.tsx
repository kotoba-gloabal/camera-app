"use client";

import { useEffect } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type ImageLightboxProps = {
  fileId: string;
  alt: string;
  onClose: () => void;
};

export function ImageLightbox({ fileId, alt, onClose }: ImageLightboxProps) {
  const { t } = useLanguage();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={t("enlargeImage")}
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] max-w-[92vw] items-center justify-center rounded-xl bg-black/20 p-2 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="absolute -right-3 -top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white text-lg font-light text-slate-800 shadow-lg transition hover:bg-slate-50"
          onClick={onClose}
          aria-label={t("closeLightbox")}
        >
          ×
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api/drive-image?fileId=${encodeURIComponent(fileId)}`}
          alt={alt}
          className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
        />
      </div>
    </div>
  );
}
