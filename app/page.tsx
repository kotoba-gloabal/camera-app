import Link from "next/link";

export default function Home() {
  return (
    <main className="space-y-4 p-6">
      <p>Used Camera B2B Catalog</p>
      <p className="flex flex-wrap gap-x-4 gap-y-2">
        <Link href="/login" className="text-blue-600 underline">
          ログイン
        </Link>
        <Link href="/products" className="text-blue-600 underline">
          商品一覧（要ログイン）
        </Link>
      </p>
    </main>
  );
}
