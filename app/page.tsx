"use client";

import { ButtonLink } from "@/components/Button";
import { Card } from "@/components/Card";
import { useLanguage } from "@/components/LanguageProvider";
import { PageContainer } from "@/components/PageContainer";

export default function Home() {
  const { t } = useLanguage();

  const features = [
    { titleKey: "feature1Title" as const, descKey: "feature1Desc" as const },
    { titleKey: "feature2Title" as const, descKey: "feature2Desc" as const },
    { titleKey: "feature3Title" as const, descKey: "feature3Desc" as const },
  ];

  return (
    <PageContainer>
      <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-gradient-to-br from-slate-50 to-white px-8 py-14 sm:px-12 sm:py-16">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#2563EB]">
            {t("homeBadge")}
          </p>
          <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-[#111827] sm:text-4xl lg:text-5xl">
            {t("homeTitle")}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#6B7280] sm:text-lg">
            {t("homeSubtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/products">{t("viewProducts")}</ButtonLink>
            <ButtonLink href="/login" variant="outline">
              {t("loginBtn")}
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 sm:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.titleKey} className="h-full">
            <h2 className="text-base font-semibold text-[#111827]">{t(feature.titleKey)}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">{t(feature.descKey)}</p>
          </Card>
        ))}
      </section>
    </PageContainer>
  );
}
