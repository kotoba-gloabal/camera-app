"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId, password }),
      });
      const data: { ok?: boolean; error?: string } = await res.json();
      setPassword("");
      if (!data.ok) {
        setError(data.error ?? "ログインに失敗しました");
        return;
      }
      setLoginId("");
      router.push("/products");
    } catch {
      setError("通信に失敗しました");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto max-w-md space-y-6 p-6">
      <h1 className="text-xl font-semibold">ログイン</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <label htmlFor="loginId">ID</label>
          <input
            id="loginId"
            name="loginId"
            type="text"
            autoComplete="username"
            className="rounded border border-neutral-300 px-2 py-1"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">PASS</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="rounded border border-neutral-300 px-2 py-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="rounded bg-neutral-800 px-3 py-2 text-white disabled:opacity-50"
          disabled={pending}
        >
          ログイン
        </button>
      </form>
      {error ? <p className="text-red-600">{error}</p> : null}
      <p>
        <Link href="/products" className="text-blue-600 underline">
          商品一覧へ（要ログイン）
        </Link>
      </p>
      <p>
        <Link href="/" className="text-blue-600 underline">
          トップへ
        </Link>
      </p>
    </main>
  );
}
