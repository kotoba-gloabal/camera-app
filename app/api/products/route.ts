import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { createDriveLookupCache, getPreferredThumbnailFileId } from "@/lib/drive";
import {
  applyProductQuery,
  parseQueryParam,
  parseSoldStatusParam,
  parseSortByParam,
  parseSortOrderParam,
} from "@/lib/products-query";
import { readProductListForCountry } from "@/lib/sheets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

function parsePageParam(value: string | null): number {
  const parsed = Number.parseInt(value ?? String(DEFAULT_PAGE), 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return DEFAULT_PAGE;
  }
  return parsed;
}

function parsePageSizeParam(value: string | null): number {
  const parsed = Number.parseInt(value ?? String(DEFAULT_PAGE_SIZE), 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return DEFAULT_PAGE_SIZE;
  }
  return Math.min(MAX_PAGE_SIZE, parsed);
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const user = await verifySessionToken(token);
  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const page = parsePageParam(searchParams.get("page"));
  const pageSize = parsePageSizeParam(searchParams.get("pageSize"));
  const filters = {
    q: parseQueryParam(searchParams.get("q")),
    soldStatus: parseSoldStatusParam(searchParams.get("soldStatus")),
  };
  const sort = {
    sortBy: parseSortByParam(searchParams.get("sortBy")),
    sortOrder: parseSortOrderParam(searchParams.get("sortOrder")),
  };

  try {
    const allProducts = await readProductListForCountry(user.country);
    const filteredProducts = applyProductQuery(allProducts, filters, sort);

    const totalItems = filteredProducts.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const currentPage = Math.min(Math.max(page, 1), totalPages);
    const start = (currentPage - 1) * pageSize;
    const pageProducts = filteredProducts.slice(start, start + pageSize);

    const cache = createDriveLookupCache();
    const productsWithThumbnails = await Promise.all(
      pageProducts.map(async (product) => ({
        ...product,
        thumbnailFileId: await getPreferredThumbnailFileId(product.id, cache),
      }))
    );

    return NextResponse.json({
      ok: true,
      user: {
        country: user.country,
        companyName: user.companyName,
        contactName: user.contactName,
      },
      pagination: {
        page: currentPage,
        pageSize,
        totalItems,
        totalPages,
        hasPrev: currentPage > 1,
        hasNext: currentPage < totalPages,
      },
      filters,
      sort,
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
