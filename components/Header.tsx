"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type MeUser = {
  country: string;
  companyName: string;
  contactName: string;
};

export function Header() {
  const [user, setUser] = useState<MeUser | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/me");
        const json = (await res.json()) as { ok?: boolean; user?: MeUser | null };
        if (!cancelled && json.ok && json.user) {
          setUser(json.user);
        }
      } catch {
        // ignore — header works without session
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header className="border-b border-slate-800/50 bg-[#0F172A] text-white shadow-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <Link href="/" className="block">
            <p className="text-lg font-semibold tracking-tight">Used Camera B2B Catalog</p>
            <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
              Japanese Inspected Cameras
            </p>
          </Link>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          {user ? (
            <div className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-xs">
              <p className="font-medium text-slate-200">{user.companyName}</p>
              <p className="text-slate-400">
                {user.country}
                {user.contactName ? ` · ${user.contactName}` : ""}
              </p>
            </div>
          ) : null}

          <nav className="flex flex-wrap items-center gap-4 text-sm font-medium">
            <Link href="/products" className="text-slate-200 transition hover:text-white">
              Products
            </Link>
            <Link href="/login" className="text-slate-200 transition hover:text-white">
              Login
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
