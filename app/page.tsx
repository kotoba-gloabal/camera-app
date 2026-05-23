import { ButtonLink } from "@/components/Button";
import { Card } from "@/components/Card";
import { PageContainer } from "@/components/PageContainer";

const FEATURES = [
  {
    title: "Japan-sourced inventory",
    description:
      "Carefully selected used cameras from the Japanese market, prepared for overseas wholesale buyers.",
  },
  {
    title: "Organized product photos",
    description:
      "Each item is documented with clear, consistent photography to support confident purchasing decisions.",
  },
  {
    title: "Country-based wholesale pricing",
    description:
      "View pricing tailored to your region after secure buyer login.",
  },
];

export default function Home() {
  return (
    <PageContainer>
      <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-gradient-to-br from-slate-50 to-white px-8 py-14 sm:px-12 sm:py-16">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#2563EB]">
            B2B Wholesale Catalog
          </p>
          <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-[#111827] sm:text-4xl lg:text-5xl">
            Japanese Used Cameras for Global Wholesale Buyers
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#6B7280] sm:text-lg">
            Carefully sourced and organized used cameras from Japan, prepared for overseas B2B
            buyers.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/products">View Products</ButtonLink>
            <ButtonLink href="/login" variant="outline">
              Login
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          <Card key={feature.title} className="h-full">
            <h2 className="text-base font-semibold text-[#111827]">{feature.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">{feature.description}</p>
          </Card>
        ))}
      </section>
    </PageContainer>
  );
}
