import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { getProductImageFileIds } from "@/lib/drive";
import { readProductByIdForCountry } from "@/lib/sheets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const user = await verifySessionToken(token);
  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const productId = decodeURIComponent(id).trim();
  if (!productId) {
    return NextResponse.json({ ok: false, error: "Not Found" }, { status: 404 });
  }

  try {
    const product = await readProductByIdForCountry(user.country, productId);
    if (!product) {
      return NextResponse.json({ ok: false, error: "Not Found" }, { status: 404 });
    }

    const imageFileIds = await getProductImageFileIds(product.id);

    return NextResponse.json({
      ok: true,
      user: {
        country: user.country,
        companyName: user.companyName,
        contactName: user.contactName,
      },
      product: {
        ...product,
        imageFileIds,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("Unsupported country")) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
  }
}
