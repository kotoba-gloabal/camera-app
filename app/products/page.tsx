"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type MeUser = {
  country: string;
  companyName: string;
  contactName: string;
};

type ProductRow = {
  id: string;
  name: string;
  price: string;
  currency: string;
  thumbnailFileId: string | null;
};

type ProductsResponse =
  | { ok: true; user: MeUser; products: ProductRow[] }
  | { ok: false; error: string };

export default function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ ok: true; user: MeUser; products: ProductRow[] } | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setUnauthorized(false);
      setError(null);
      setData(null);
      try {
        const res = await fetch("/api/products");
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
      } catch {
        if (!cancelled) setError("通信に失敗しました");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <main className="mx-auto max-w-5xl space-y-6 p-6">
        <h1 className="text-xl font-semibold">商品一覧</h1>

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
                <span className="font-medium">商品件数:</span> {data.products.length}
              </p>
            </section>

            <div className="overflow-x-auto rounded border border-neutral-300">
              <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-300 bg-neutral-50">
                    <th className="border-b border-neutral-200 px-3 py-2 font-medium">画像</th>
                    <th className="border-b border-neutral-200 px-3 py-2 font-medium">ID</th>
                    <th className="border-b border-neutral-200 px-3 py-2 font-medium">製品名</th>
                    <th className="border-b border-neutral-200 px-3 py-2 font-medium">価格</th>
                    <th className="border-b border-neutral-200 px-3 py-2 font-medium">通貨</th>
                  </tr>
                </thead>
                <tbody>
                  {data.products.map((p, index) => (
                    <tr key={`${index}-${p.id}`} className="border-b border-neutral-100 last:border-b-0">
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
                      <td className="px-3 py-2 align-top">{p.price}</td>
                      <td className="px-3 py-2 align-top">{p.currency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
