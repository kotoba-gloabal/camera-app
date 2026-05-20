"use client";

import Link from "next/link";
import { useState } from "react";

type MeUser = {
  country: string;
  companyName: string;
  contactName: string;
};

export default function LoginPage() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<MeUser | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setUser(null);
    setSuccess(false);
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
      setSuccess(true);
      const meRes = await fetch("/api/me");
      const meData: { ok?: boolean; user?: MeUser | null } = await meRes.json();
      if (meData.ok && meData.user) {
        setUser(meData.user);
      }
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
      {success ? <p className="text-green-700">ログイン成功</p> : null}
      {user ? (
        <section className="rounded border border-neutral-200 p-3 text-sm">
          <p>国: {user.country}</p>
          <p>社名: {user.companyName}</p>
          <p>担当者: {user.contactName}</p>
        </section>
      ) : null}
      <p>
        <Link href="/" className="text-blue-600 underline">
          トップへ
        </Link>
      </p>
    </main>
  );
}
