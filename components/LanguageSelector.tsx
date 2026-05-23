"use client";

import { LOCALE_LABELS, LOCALES, type Locale } from "@/lib/i18n";
import { useLanguage } from "@/components/LanguageProvider";

export function LanguageSelector() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div className="flex flex-col gap-1 sm:items-end">
      <label htmlFor="language-select" className="sr-only">
        {t("languageLabel")}
      </label>
      <select
        id="language-select"
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="min-w-[10rem] rounded-lg border border-slate-600 bg-slate-800 px-2.5 py-1.5 text-sm text-slate-100 shadow-sm transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        aria-label={t("languageLabel")}
      >
        {LOCALES.map((code) => (
          <option key={code} value={code} className="bg-slate-800 text-slate-100">
            {LOCALE_LABELS[code]}
          </option>
        ))}
      </select>
    </div>
  );
}
