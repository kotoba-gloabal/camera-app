"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type MeUser = {
  country: string;
  companyName: string;
  contactName: string;
};

type ProductDetail = {
  id: string;
  name: string;
  price: string;
  currency: string;
  imageFileIds: string[];
};

type ProductDetailResponse =
  | { ok: true; user: MeUser; product: ProductDetail }
  | { ok: false; error: string };

export default function ProductDetailPage() {
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
    if (!selectedImageFileId) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedImageFileId(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedImageFileId]);

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
  }, [productId]);

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <main className="mx-auto max-w-5xl space-y-6 p-6">
        <h1 className="text-xl font-semibold">商品詳細</h1>

        {loading ? <p>読み込み中…</p> : null}

        {!loading && unauthorized ? (
          <div className="space-y-3 rounded border border-neutral-200 bg-white p-4">
            <p>ログインしてください。</p>
            <Link href="/login" className="text-blue-600 underline">
              ログインへ
            </Link>
          </div>
        ) : null}

        {!loading && notFound ? (
          <div className="space-y-3 rounded border border-neutral-200 bg-white p-4">
            <p>商品が見つかりません。</p>
            <Link href="/products" className="text-blue-600 underline">
              商品一覧へ
            </Link>
          </div>
        ) : null}

        {!loading && error ? <p className="text-red-600">{error}</p> : null}

        {!loading && data ? (
          <div className="space-y-6">
            <section className="space-y-2 rounded border border-neutral-200 p-4 text-sm">
              <p>
                <span className="font-medium">商品ID:</span>{" "}
                <span className="font-mono">{data.product.id}</span>
              </p>
              <p>
                <span className="font-medium">製品名:</span> {data.product.name}
              </p>
              <p>
                <span className="font-medium">価格:</span> {data.product.price}
              </p>
              <p>
                <span className="font-medium">通貨:</span> {data.product.currency}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-medium">画像</h2>
              {data.product.imageFileIds.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {data.product.imageFileIds.map((fileId) => (
                    <button
                      key={fileId}
                      type="button"
                      className="cursor-pointer rounded border border-neutral-200 p-0"
                      onClick={() => setSelectedImageFileId(fileId)}
                      aria-label={`${data.product.name} の画像を拡大表示`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/api/drive-image?fileId=${encodeURIComponent(fileId)}`}
                        alt={data.product.name}
                        loading="lazy"
                        className="aspect-square w-full rounded object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-600">画像がありません</p>
              )}
            </section>

            <p>
              <Link href="/products" className="text-blue-600 underline">
                商品一覧へ戻る
              </Link>
            </p>
          </div>
        ) : null}

        {!loading && !data && !unauthorized && !notFound && !error ? (
          <p>
            <Link href="/products" className="text-blue-600 underline">
              商品一覧へ
            </Link>
          </p>
        ) : null}
      </main>

      {selectedImageFileId ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="拡大画像"
          onClick={() => setSelectedImageFileId(null)}
        >
          <div
            className="relative max-h-[85vh] max-w-[90vw]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="absolute -right-2 -top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl leading-none text-neutral-800 shadow-md"
              onClick={() => setSelectedImageFileId(null)}
              aria-label="閉じる"
            >
              ×
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/drive-image?fileId=${encodeURIComponent(selectedImageFileId)}`}
              alt={data?.product.name ?? "商品画像"}
              className="max-h-[85vh] max-w-[90vw] object-contain"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
