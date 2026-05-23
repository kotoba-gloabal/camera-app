import type { ProductListItemPublic } from "@/lib/sheets";

export type SoldStatusFilter = "includeSoldOut" | "excludeSoldOut" | "onlySoldOut";
export type ProductSortBy = "id" | "name" | "price" | "status";
export type SortOrder = "asc" | "desc";

export type ProductQueryFilters = {
  q: string;
  soldStatus: SoldStatusFilter;
};

export type ProductQuerySort = {
  sortBy: ProductSortBy;
  sortOrder: SortOrder;
};

const DEFAULT_SOLD_STATUS: SoldStatusFilter = "includeSoldOut";
const DEFAULT_SORT_BY: ProductSortBy = "id";
const DEFAULT_SORT_ORDER: SortOrder = "asc";

const VALID_SOLD_STATUS = new Set<SoldStatusFilter>([
  "includeSoldOut",
  "excludeSoldOut",
  "onlySoldOut",
]);

const VALID_SORT_BY = new Set<ProductSortBy>(["id", "name", "price", "status"]);
const VALID_SORT_ORDER = new Set<SortOrder>(["asc", "desc"]);

export function parseSoldStatusParam(value: string | null): SoldStatusFilter {
  if (value && VALID_SOLD_STATUS.has(value as SoldStatusFilter)) {
    return value as SoldStatusFilter;
  }
  return DEFAULT_SOLD_STATUS;
}

export function parseSortByParam(value: string | null): ProductSortBy {
  if (value && VALID_SORT_BY.has(value as ProductSortBy)) {
    return value as ProductSortBy;
  }
  return DEFAULT_SORT_BY;
}

export function parseSortOrderParam(value: string | null): SortOrder {
  if (value && VALID_SORT_ORDER.has(value as SortOrder)) {
    return value as SortOrder;
  }
  return DEFAULT_SORT_ORDER;
}

export function parseQueryParam(value: string | null): string {
  return (value ?? "").trim();
}

function parsePriceForSort(price: string | null): number | null {
  if (!price) return null;
  const cleaned = price.replace(/[¥,\s]/g, "");
  const num = Number.parseFloat(cleaned);
  return Number.isFinite(num) ? num : null;
}

function matchesSearchQuery(product: ProductListItemPublic, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  return (
    product.id.toLowerCase().includes(needle) || product.name.toLowerCase().includes(needle)
  );
}

function matchesSoldStatusFilter(
  product: ProductListItemPublic,
  soldStatus: SoldStatusFilter
): boolean {
  if (soldStatus === "excludeSoldOut") return !product.soldOut;
  if (soldStatus === "onlySoldOut") return product.soldOut;
  return true;
}

function compareStrings(a: string, b: string, sortOrder: SortOrder): number {
  const result = a.localeCompare(b, undefined, { sensitivity: "base" });
  return sortOrder === "asc" ? result : -result;
}

function compareProducts(
  a: ProductListItemPublic,
  b: ProductListItemPublic,
  sortBy: ProductSortBy,
  sortOrder: SortOrder
): number {
  if (sortBy === "price") {
    const aNum = parsePriceForSort(a.price);
    const bNum = parsePriceForSort(b.price);
    if (aNum === null && bNum === null) return 0;
    if (aNum === null) return 1;
    if (bNum === null) return -1;
    const diff = aNum - bNum;
    return sortOrder === "asc" ? diff : -diff;
  }

  if (sortBy === "name") {
    return compareStrings(a.name, b.name, sortOrder);
  }

  if (sortBy === "status") {
    return compareStrings(a.listingStatus, b.listingStatus, sortOrder);
  }

  return compareStrings(a.id, b.id, sortOrder);
}

/**
 * 非掲載除外後の商品に対し、検索・売約済みフィルター・並べ替えを適用する。
 */
export function applyProductQuery(
  products: ProductListItemPublic[],
  filters: ProductQueryFilters,
  sort: ProductQuerySort
): ProductListItemPublic[] {
  const q = filters.q.trim();

  const filtered = products.filter(
    (product) =>
      matchesSearchQuery(product, q) && matchesSoldStatusFilter(product, filters.soldStatus)
  );

  return [...filtered].sort((a, b) => compareProducts(a, b, sort.sortBy, sort.sortOrder));
}
