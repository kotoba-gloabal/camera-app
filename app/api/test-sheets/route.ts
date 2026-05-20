import { NextResponse } from "next/server";
import { readProductListTestRange } from "@/lib/sheets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { values } = await readProductListTestRange();
    return NextResponse.json({
      ok: true,
      sheetName: "製品リスト",
      range: "A1:J5",
      values,
    });
  } catch (err) {
    const error =
      err instanceof Error ? err.message : typeof err === "string" ? err : "Unknown error";
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }
}
