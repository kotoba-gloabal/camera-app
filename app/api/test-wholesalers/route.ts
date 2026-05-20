import { NextResponse } from "next/server";
import { readWholesalerListTestParsed } from "@/lib/sheets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { headers, rows } = await readWholesalerListTestParsed();
    return NextResponse.json({
      ok: true,
      sheetName: "卸先リスト",
      range: "A1:E20",
      headers,
      rowCount: rows.length,
      rows,
    });
  } catch (err) {
    const error =
      err instanceof Error ? err.message : typeof err === "string" ? err : "Unknown error";
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }
}
