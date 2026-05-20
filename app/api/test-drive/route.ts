import { NextRequest, NextResponse } from "next/server";
import { findProductDriveImages } from "@/lib/drive";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_PRODUCT_ID = "V200-63-4";

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get("productId")?.trim() || DEFAULT_PRODUCT_ID;

  try {
    const result = await findProductDriveImages(productId);
    return NextResponse.json({
      ok: true,
      productId: result.productId,
      parsed: result.parsed,
      folders: result.folders,
      images: result.images,
      imageCount: result.imageCount,
    });
  } catch (err) {
    const error =
      err instanceof Error ? err.message : typeof err === "string" ? err : "Unknown error";
    return NextResponse.json({ ok: false, productId, error }, { status: 500 });
  }
}
