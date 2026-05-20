import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { createDriveLookupCache } from "@/lib/drive";
import { readProductListForCountry } from "@/lib/sheets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const user = await verifySessionToken(token);
  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const products = await readProductListForCountry(user.country);
    const cache = createDriveLookupCache();
    const productsWithThumbnails = await Promise.all(
      products.map(async (product) => ({
        ...product,
        thumbnailFileId: await cache.getProductThumbnailFileId(product.id),
      }))
    );

    return NextResponse.json({
      ok: true,
      user: {
        country: user.country,
        companyName: user.companyName,
        contactName: user.contactName,
      },
      products: productsWithThumbnails,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("Unsupported country")) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
  }
}
