"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { PageContainer } from "@/components/PageContainer";

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
    <PageContainer className="flex min-h-[calc(100vh-5rem)] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <Card>
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#2563EB]">
              Wholesale Access
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-[#111827]">Buyer Login</h1>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
              Access wholesale camera inventory and country-specific pricing.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label htmlFor="loginId" className="text-sm font-medium text-[#111827]">
                Login ID
              </label>
              <input
                id="loginId"
                name="loginId"
                type="text"
                autoComplete="username"
                className="input-field"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-[#111827]">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-[#DC2626]">
                {error}
              </div>
            ) : null}

            <Button type="submit" variant="secondary" className="w-full" disabled={pending}>
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6B7280]">
            <Link href="/" className="font-medium text-[#2563EB] hover:underline">
              Back to home
            </Link>
          </p>
        </Card>
      </div>
    </PageContainer>
  );
}
