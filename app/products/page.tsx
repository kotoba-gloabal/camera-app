"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

const SORT_OPTIONS = [
  { value: "id:asc", label: "商品ID 昇順" },
  { value: "id:desc", label: "商品ID 降順" },
  { value: "name:asc", label: "商品名 昇順" },
  { value: "name:desc", label: "商品名 降順" },
  { value: "price:asc", label: "価格 昇順" },
  { value: "price:desc", label: "価格 降順" },
] as const;

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
          setError(json.error ?? "読み込みに失敗しました");
          return;
        }
        setData(json);
        setSearchInput(json.filters.q);
        setSortValue(buildSortValue(json.sort.sortBy, json.sort.sortOrder));
      } catch {
        if (!cancelled) setError("通信に失敗しました");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, appliedQuery]);

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <main className="mx-auto max-w-5xl space-y-6 p-6">
        <h1 className="text-xl font-semibold">商品一覧</h1>

        {!unauthorized ? (
          <section className="space-y-4 rounded border border-neutral-200 bg-white p-4">
            <form
              className="flex flex-col gap-3 sm:flex-row sm:items-end"
              onSubmit={(e) => {
                e.preventDefault();
                applySearch(1);
              }}
            >
              <div className="flex flex-1 flex-col gap-1">
                <label htmlFor="search" className="text-sm font-medium">
                  検索
                </label>
                <input
                  id="search"
                  type="search"
                  placeholder="ID・商品名で検索"
                  className="rounded border border-neutral-300 px-3 py-2 text-sm"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="rounded bg-neutral-800 px-4 py-2 text-sm text-white"
              >
                検索
              </button>
            </form>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
              <div className="flex flex-col gap-1">
                <label htmlFor="soldStatus" className="text-sm font-medium">
                  売約済み表示
                </label>
                <select
                  id="soldStatus"
                  className="rounded border border-neutral-300 px-3 py-2 text-sm"
                  value={appliedQuery.soldStatus}
                  onChange={(e) => applySoldStatus(e.target.value as SoldStatusFilter)}
                >
                  <option value="includeSoldOut">売約済みも表示</option>
                  <option value="excludeSoldOut">売約済みを除外</option>
                  <option value="onlySoldOut">売約済みのみ</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="sort" className="text-sm font-medium">
                  並べ替え
                </label>
                <select
                  id="sort"
                  className="rounded border border-neutral-300 px-3 py-2 text-sm"
                  value={sortValue}
                  onChange={(e) => applySort(e.target.value)}
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>
        ) : null}

        {loading ? <p>読み込み中…</p> : null}

        {!loading && unauthorized ? (
          <div className="space-y-3 rounded border border-neutral-200 bg-white p-4">
            <p>ログインしてください。</p>
            <Link href="/login" className="text-blue-600 underline">
              ログインへ
            </Link>
          </div>
        ) : null}

        {!loading && error ? <p className="text-red-600">{error}</p> : null}

        {!loading && data ? (
          <div className="space-y-4">
            <section className="text-sm">
              <p>
                <span className="font-medium">国:</span> {data.user.country}
              </p>
              <p>
                <span className="font-medium">社名:</span> {data.user.companyName}
              </p>
              <p>
                <span className="font-medium">商品件数:</span> {data.pagination.totalItems}
              </p>
              <p>
                <span className="font-medium">ページ:</span> {data.pagination.page} /{" "}
                {data.pagination.totalPages}
              </p>
            </section>

            {data.products.length === 0 ? (
              <p className="rounded border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
                該当する商品がありません
              </p>
            ) : (
              <div className="overflow-x-auto rounded border border-neutral-300">
                <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-neutral-300 bg-neutral-50">
                      <th className="border-b border-neutral-200 px-3 py-2 font-medium">画像</th>
                      <th className="border-b border-neutral-200 px-3 py-2 font-medium">ID</th>
                      <th className="border-b border-neutral-200 px-3 py-2 font-medium">製品名</th>
                      <th className="border-b border-neutral-200 px-3 py-2 font-medium">価格</th>
                      <th className="border-b border-neutral-200 px-3 py-2 font-medium">通貨</th>
                      <th className="border-b border-neutral-200 px-3 py-2 font-medium">詳細</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.products.map((p, index) => (
                      <tr
                        key={`${index}-${p.id}`}
                        className="border-b border-neutral-100 last:border-b-0"
                      >
                        <td className="px-3 py-2 align-top">
                          {p.thumbnailFileId ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={`/api/drive-image?fileId=${encodeURIComponent(p.thumbnailFileId)}`}
                              alt={p.name}
                              loading="lazy"
                              className="h-16 w-16 rounded border border-neutral-200 object-cover"
                            />
                          ) : (
                            <span className="inline-flex h-16 w-16 items-center justify-center rounded border border-dashed border-neutral-300 bg-neutral-50 text-xs text-neutral-500">
                              No Image
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 align-top font-mono text-xs">{p.id}</td>
                        <td className="px-3 py-2 align-top">{p.name}</td>
                        <td className="px-3 py-2 align-top">
                          {p.soldOut ? (
                            <span className="font-medium text-red-600">売約済み</span>
                          ) : (
                            p.price
                          )}
                        </td>
                        <td className="px-3 py-2 align-top">{p.soldOut ? "" : p.currency}</td>
                        <td className="px-3 py-2 align-top">
                          <Link
                            href={`/products/${encodeURIComponent(p.id)}`}
                            className="text-blue-600 underline"
                          >
                            詳細
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="rounded border border-neutral-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                disabled={!data.pagination.hasPrev || loading}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                前へ
              </button>
              <button
                type="button"
                className="rounded border border-neutral-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                disabled={!data.pagination.hasNext || loading}
                onClick={() => setPage((current) => current + 1)}
              >
                次へ
              </button>
              <span className="text-sm text-neutral-600">
                {data.pagination.page} / {data.pagination.totalPages} ページ（全{" "}
                {data.pagination.totalItems} 件）
              </span>
            </div>
          </div>
        ) : null}

        <p>
          <Link href="/" className="text-blue-600 underline">
            トップへ
          </Link>
        </p>
      </main>
    </div>
  );
}
