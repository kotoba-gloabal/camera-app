"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button, ButtonLink } from "@/components/Button";
import { Card } from "@/components/Card";
import { useLanguage } from "@/components/LanguageProvider";
import { PageContainer } from "@/components/PageContainer";
import type { MessageKey } from "@/lib/i18n";

const PAGE_SIZE = 20;

type SoldStatusFilter = "includeSoldOut" | "excludeSoldOut" | "onlySoldOut";

type MeUser = {
  country: string;
  companyName: string;
  contactName: string;
};

type ProductRow = {
  id: string;
  name: string;
  price: string | null;
  currency: string | null;
  hidePrice: boolean;
  soldOut: boolean;
  listingStatus: string;
  thumbnailFileId: string | null;
};

type Pagination = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
};

type ProductQuery = {
  q: string;
  soldStatus: SoldStatusFilter;
  sortBy: string;
  sortOrder: string;
};

type ProductsResponse =
  | {
      ok: true;
      user: MeUser;
      pagination: Pagination;
      filters: ProductQuery;
      sort: { sortBy: string; sortOrder: string };
      products: ProductRow[];
    }
  | { ok: false; error: string };

const DEFAULT_QUERY: ProductQuery = {
  q: "",
  soldStatus: "includeSoldOut",
  sortBy: "id",
  sortOrder: "asc",
};

const SORT_OPTION_VALUES: { value: string; labelKey: MessageKey }[] = [
  { value: "id:asc", labelKey: "sortIdAsc" },
  { value: "id:desc", labelKey: "sortIdDesc" },
  { value: "name:asc", labelKey: "sortNameAsc" },
  { value: "name:desc", labelKey: "sortNameDesc" },
  { value: "price:asc", labelKey: "sortPriceAsc" },
  { value: "price:desc", labelKey: "sortPriceDesc" },
];

function parseSortValue(value: string): { sortBy: string; sortOrder: string } {
  const [sortBy, sortOrder] = value.split(":");
  return { sortBy: sortBy ?? "id", sortOrder: sortOrder ?? "asc" };
}

function buildSortValue(sortBy: string, sortOrder: string): string {
  return `${sortBy}:${sortOrder}`;
}

function buildApiParams(page: number, query: ProductQuery): URLSearchParams {
  return new URLSearchParams({
    page: String(page),
    pageSize: String(PAGE_SIZE),
    q: query.q,
    soldStatus: query.soldStatus,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  });
}

export default function ProductsPage() {
  const { t } = useLanguage();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [appliedQuery, setAppliedQuery] = useState<ProductQuery>(DEFAULT_QUERY);
  const [sortValue, setSortValue] = useState("id:asc");
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    ok: true;
    user: MeUser;
    pagination: Pagination;
    products: ProductRow[];
  } | null>(null);

  const sortOptions = useMemo(
    () => SORT_OPTION_VALUES.map((opt) => ({ value: opt.value, label: t(opt.labelKey) })),
    [t]
  );

  function applySearch(nextPage = 1) {
    const { sortBy, sortOrder } = parseSortValue(sortValue);
    setAppliedQuery({
      q: searchInput.trim(),
      soldStatus: appliedQuery.soldStatus,
      sortBy,
      sortOrder,
    });
    setPage(nextPage);
  }

  function applySoldStatus(soldStatus: SoldStatusFilter) {
    const { sortBy, sortOrder } = parseSortValue(sortValue);
    setAppliedQuery({
      ...appliedQuery,
      soldStatus,
      sortBy,
      sortOrder,
    });
    setPage(1);
  }

  function applySort(value: string) {
    setSortValue(value);
    const { sortBy, sortOrder } = parseSortValue(value);
    setAppliedQuery({
      ...appliedQuery,
      sortBy,
      sortOrder,
    });
    setPage(1);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setUnauthorized(false);
      setError(null);
      setData(null);
      try {
        const params = buildApiParams(page, appliedQuery);
        const res = await fetch(`/api/products?${params.toString()}`);
        const json = (await res.json()) as ProductsResponse;
        if (cancelled) return;
        if (res.status === 401 || (!json.ok && json.error === "Unauthorized")) {
          setUnauthorized(true);
          return;
        }
        if (!json.ok) {
          setError(json.error ?? t("loadFailed"));
          return;
        }
        setData(json);
        setSearchInput(json.filters.q);
        setSortValue(buildSortValue(json.sort.sortBy, json.sort.sortOrder));
      } catch {
        if (!cancelled) setError(t("networkError"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, appliedQuery]);

  return (
    <PageContainer className="space-y-8">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#2563EB]">
          {t("inventoryBadge")}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#111827]">
          {t("productsTitle")}
        </h1>
        <p className="mt-2 max-w-2xl text-[#6B7280]">{t("productsSubtitle")}</p>
      </section>

      {loading ? (
        <Card>
          <p className="text-sm text-[#6B7280]">{t("loadingInventory")}</p>
        </Card>
      ) : null}

      {!loading && unauthorized ? (
        <Card className="text-center">
          <p className="text-[#111827]">{t("pleaseSignIn")}</p>
          <div className="mt-4">
            <ButtonLink href="/login">{t("navLogin")}</ButtonLink>
          </div>
        </Card>
      ) : null}

      {!loading && error ? (
        <Card>
          <p className="text-sm text-[#DC2626]">{error}</p>
        </Card>
      ) : null}

      {!loading && data ? (
        <>
          <Card className="flex flex-wrap items-center gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
                {t("buyerAccount")}
              </p>
              <p className="mt-1 text-sm font-semibold text-[#111827]">{data.user.companyName}</p>
              <p className="text-sm text-[#6B7280]">{data.user.country}</p>
            </div>
            <div className="ml-auto text-right text-sm text-[#6B7280]">
              <p>{t("itemsCount", { count: data.pagination.totalItems })}</p>
              <p>
                {t("pageOf", {
                  page: data.pagination.page,
                  total: data.pagination.totalPages,
                })}
              </p>
            </div>
          </Card>

          <Card className="space-y-5">
            <form
              className="flex flex-col gap-4 lg:flex-row lg:items-end"
              onSubmit={(e) => {
                e.preventDefault();
                applySearch(1);
              }}
            >
              <div className="flex-1 space-y-1.5">
                <label htmlFor="search" className="text-sm font-medium text-[#111827]">
                  {t("searchLabel")}
                </label>
                <input
                  id="search"
                  type="search"
                  placeholder={t("searchPlaceholder")}
                  className="input-field"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <Button type="submit">{t("searchButton")}</Button>
            </form>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="soldStatus" className="text-sm font-medium text-[#111827]">
                  {t("soldItemsLabel")}
                </label>
                <select
                  id="soldStatus"
                  className="select-field"
                  value={appliedQuery.soldStatus}
                  onChange={(e) => applySoldStatus(e.target.value as SoldStatusFilter)}
                >
                  <option value="includeSoldOut">{t("includeSoldOut")}</option>
                  <option value="excludeSoldOut">{t("excludeSoldOut")}</option>
                  <option value="onlySoldOut">{t("onlySoldOut")}</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="sort" className="text-sm font-medium text-[#111827]">
                  {t("sortByLabel")}
                </label>
                <select
                  id="sort"
                  className="select-field"
                  value={sortValue}
                  onChange={(e) => applySort(e.target.value)}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {data.products.length === 0 ? (
            <Card className="py-12 text-center">
              <p className="text-base font-medium text-[#111827]">{t("noMatchingProducts")}</p>
              <p className="mt-1 text-sm text-[#6B7280]">{t("noMatchingHint")}</p>
            </Card>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.products.map((p) => (
                <Card key={p.id} className="flex flex-col overflow-hidden p-0">
                  <Link
                    href={`/products/${encodeURIComponent(p.id)}`}
                    className="group relative block aspect-square cursor-pointer bg-white p-3"
                    aria-label={t("viewProductPhoto")}
                  >
                    {p.thumbnailFileId ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/api/drive-image?fileId=${encodeURIComponent(p.thumbnailFileId)}`}
                          alt={p.name}
                          loading="lazy"
                          className="h-full w-full rounded-lg border border-gray-100 object-cover shadow-sm transition duration-200 group-hover:scale-[1.02] group-hover:opacity-95"
                        />
                        <span className="pointer-events-none absolute inset-3 rounded-lg bg-black/0 transition duration-200 group-hover:bg-black/10" />
                      </>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-xs text-[#6B7280] transition group-hover:border-blue-200 group-hover:bg-blue-50/30">
                        {t("noImage")}
                      </div>
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col gap-3 border-t border-gray-100 p-4">
                    <div>
                      <p className="font-mono text-xs text-[#6B7280]">{p.id}</p>
                      <h2 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-[#111827]">
                        {p.name}
                      </h2>
                    </div>
                    <div>
                      {p.soldOut ? (
                        <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-[#DC2626] ring-1 ring-red-200">
                          {t("soldOut")}
                        </span>
                      ) : p.hidePrice ? null : (
                        <p className="text-lg font-semibold text-[#111827]">
                          {p.price}{" "}
                          <span className="text-sm font-medium text-[#6B7280]">{p.currency}</span>
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/products/${encodeURIComponent(p.id)}`}
                      className="mt-auto text-sm font-medium text-[#2563EB] hover:underline"
                    >
                      {t("viewDetails")}
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {data.products.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={!data.pagination.hasPrev || loading}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                {t("previous")}
              </Button>
              <span className="px-2 text-sm text-[#6B7280]">
                {t("pageOf", {
                  page: data.pagination.page,
                  total: data.pagination.totalPages,
                })}
              </span>
              <Button
                type="button"
                variant="outline"
                disabled={!data.pagination.hasNext || loading}
                onClick={() => setPage((current) => current + 1)}
              >
                {t("next")}
              </Button>
            </div>
          ) : null}
        </>
      ) : null}
    </PageContainer>
  );
}
