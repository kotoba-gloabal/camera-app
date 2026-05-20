import Link from "next/link";

export default function Home() {
  return (
    <main className="space-y-4 p-6">
      <p>Used Camera B2B Catalog</p>
      <p>
        <Link href="/login" className="text-blue-600 underline">
          ログイン
        </Link>
      </p>
    </main>
  );
}
