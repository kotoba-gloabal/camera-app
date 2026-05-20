import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE_NAME, sessionCookieOptions } from "@/lib/auth";
import { findWholesalerSessionPayload } from "@/lib/sheets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ ok: false, error: "無効なリクエストです" }, { status: 400 });
    }

    const loginId =
      typeof body === "object" && body !== null && "loginId" in body
        ? (body as { loginId: unknown }).loginId
        : undefined;
    const password =
      typeof body === "object" && body !== null && "password" in body
        ? (body as { password: unknown }).password
        : undefined;

    if (typeof loginId !== "string" || typeof password !== "string") {
      return NextResponse.json({ ok: false, error: "IDとパスワードを入力してください" }, { status: 400 });
    }

    if (!loginId || !password) {
      return NextResponse.json({ ok: false, error: "IDとパスワードを入力してください" }, { status: 400 });
    }

    const session = await findWholesalerSessionPayload(loginId, password);
    if (!session) {
      return NextResponse.json({ ok: false, error: "ログインに失敗しました" }, { status: 401 });
    }

    const token = await createSessionToken(session);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions());
    return res;
  } catch {
    return NextResponse.json({ ok: false, error: "サーバーエラーです" }, { status: 500 });
  }
}
