"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/Button";
import { Card } from "@/components/Card";
import { ImageLightbox } from "@/components/ImageLightbox";
import { useLanguage } from "@/components/LanguageProvider";
import { PageContainer } from "@/components/PageContainer";

type MeUser = {
  country: string;
  companyName: string;
  contactName: string;
};

type ProductDetail = {
  id: string;
  name: string;
  price: string | null;
  currency: string | null;
  soldOut: boolean;
  listingStatus: string;
  imageFileIds: string[];
};

type ProductDetailResponse =
  | { ok: true; user: MeUser; product: ProductDetail }
  | { ok: false; error: string };

export default function ProductDetailPage() {
  const { t } = useLanguage();
  const params = useParams<{ id: string }>();
  const productId = decodeURIComponent(params.id ?? "");

  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ ok: true; user: MeUser; product: ProductDetail } | null>(
    null
  );
  const [selectedImageFileId, setSelectedImageFileId] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setUnauthorized(false);
      setNotFound(false);
      setError(null);
      setData(null);
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(productId)}`);
        const json = (await res.json()) as ProductDetailResponse;
        if (cancelled) return;

        if (res.status === 401 || (!json.ok && json.error === "Unauthorized")) {
          setUnauthorized(true);
          return;
        }
        if (res.status === 404 || (!json.ok && json.error === "Not Found")) {
          setNotFound(true);
          return;
        }
        if (!json.ok) {
          setError(json.error ?? t("loadFailed"));
          return;
        }
        setData(json);
      } catch {
        if (!cancelled) setError(t("networkError"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  return (
    <PageContainer className="space-y-8">
      <Link
        href="/products"
        className="inline-flex items-center text-sm font-medium text-[#2563EB] hover:underline"
      >
        {t("backToProducts")}
      </Link>

      {loading ? (
        <Card>
          <p className="text-sm text-[#6B7280]">{t("loadingProduct")}</p>
        </Card>
      ) : null}

      {!loading && unauthorized ? (
        <Card className="text-center">
          <p className="text-[#111827]">{t("pleaseSignInDetail")}</p>
          <div className="mt-4">
            <ButtonLink href="/login">{t("navLogin")}</ButtonLink>
          </div>
        </Card>
      ) : null}

      {!loading && notFound ? (
        <Card className="text-center">
          <p className="font-medium text-[#111827]">{t("productNotFound")}</p>
          <p className="mt-2 text-sm text-[#6B7280]">{t("productNotFoundHint")}</p>
          <div className="mt-4">
            <ButtonLink href="/products" variant="outline">
              {t("backToInventory")}
            </ButtonLink>
          </div>
        </Card>
      ) : null}

      {!loading && error ? (
        <Card>
          <p className="text-sm text-[#DC2626]">{error}</p>
        </Card>
      ) : null}

      {!loading && data ? (
        <div className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
            <section className="space-y-6">
              <div>
                <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs font-medium text-[#6B7280]">
                  {data.product.id}
                </span>
                <h1 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-[#111827] sm:text-3xl">
                  {data.product.name}
                </h1>
              </div>

              <div>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#6B7280]">
                  {t("productPhotos")}
                </h2>
                {data.product.imageFileIds.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {data.product.imageFileIds.map((fileId) => (
                      <button
                        key={fileId}
                        type="button"
                        className="group overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                        onClick={() => setSelectedImageFileId(fileId)}
                        aria-label={t("enlargeImage")}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/api/drive-image?fileId=${encodeURIComponent(fileId)}`}
                          alt={data.product.name}
                          loading="lazy"
                          className="aspect-square w-full rounded-lg object-cover transition duration-200 group-hover:scale-[1.02] group-hover:opacity-95"
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <p className="text-sm text-[#6B7280]">{t("noImagesAvailable")}</p>
                  </Card>
                )}
              </div>
            </section>

            <aside className="space-y-4 lg:sticky lg:top-8">
              <Card>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                  {t("pricingLabel")}
                </p>
                {data.product.soldOut ? (
                  <p className="mt-3 text-2xl font-bold text-[#DC2626]">{t("soldOut")}</p>
                ) : (
                  <div className="mt-3">
                    <p className="text-3xl font-bold tracking-tight text-[#111827]">
                      {data.product.price}
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#6B7280]">
                      {data.product.currency}
                    </p>
                  </div>
                )}
              </Card>

              <Card className="text-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                  {t("buyerLabel")}
                </p>
                <p className="mt-2 font-medium text-[#111827]">{data.user.companyName}</p>
                <p className="text-[#6B7280]">{data.user.country}</p>
              </Card>
            </aside>
          </div>
        </div>
      ) : null}

      {selectedImageFileId && data ? (
        <ImageLightbox
          fileId={selectedImageFileId}
          alt={data.product.name}
          onClose={() => setSelectedImageFileId(null)}
        />
      ) : null}
    </PageContainer>
  );
}
