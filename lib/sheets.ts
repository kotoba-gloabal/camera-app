import { createSheetsClient } from "@/lib/google";

const PRODUCT_SHEET_NAME = "製品リスト";
const TEST_RANGE = "A1:J5";
const PRODUCT_LIST_DATA_RANGE = "A:I";

const WHOLESALER_SHEET_NAME = "卸先リスト";
const WHOLESALER_TEST_RANGE = "A1:E20";

type Cell = string | number | boolean | null | undefined;

function cellString(value: Cell): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function hasNonEmptyCell(value: Cell): boolean {
  return cellString(value).length > 0;
}

/** C列・D列と入力を完全一致比較する（前後空白は含めたまま比較）。 */
function cellExactString(value: Cell): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

const ALLOWED_LOGIN_COUNTRIES = new Set(["香港", "中国", "タイ"]);

export type WholesalerTestRow = {
  country: string;
  companyName: string;
  hasLoginId: boolean;
  hasPassword: boolean;
  contactName: string;
};

/**
 * 「製品リスト」シートの A1:J5 を取得する（接続テスト用）。
 */
export async function readProductListTestRange(): Promise<{
  values: (string | number | boolean | null)[][];
}> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEET_ID is not set");
  }

  const sheets = createSheetsClient();
  const range = `'${PRODUCT_SHEET_NAME.replace(/'/g, "''")}'!${TEST_RANGE}`;

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const raw = res.data.values;
  const values = (raw ?? []) as (string | number | boolean | null)[][];

  return { values };
}

/**
 * 「卸先リスト」シートの A1:E20 を取得し、ログインID/パスワード列の実値は捨てて安全な形にする（接続テスト用）。
 * C列・D列は存在有無のみ（実値は返さない）。
 */
export async function readWholesalerListTestParsed(): Promise<{
  headers: string[];
  rows: WholesalerTestRow[];
}> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEET_ID is not set");
  }

  const sheets = createSheetsClient();
  const range = `'${WHOLESALER_SHEET_NAME.replace(/'/g, "''")}'!${WHOLESALER_TEST_RANGE}`;

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const raw = res.data.values;
  const values = (raw ?? []) as Cell[][];

  if (values.length === 0) {
    return { headers: [], rows: [] };
  }

  const headerRow = values[0] ?? [];
  const headers = [0, 1, 2, 3, 4].map((i) => cellString(headerRow[i]));

  const dataRows = values.slice(1);
  const rows: WholesalerTestRow[] = dataRows.map((row) => ({
    country: cellString(row[0]),
    companyName: cellString(row[1]),
    hasLoginId: hasNonEmptyCell(row[2]),
    hasPassword: hasNonEmptyCell(row[3]),
    contactName: cellString(row[4]),
  }));

  return { headers, rows };
}

/**
 * 「卸先リスト」で ID(C列)・PASS(D列) が完全一致する行を探し、許可国のみセッション用ペイロードを返す。
 * ID/PASS の実値は返さない。
 */
export async function findWholesalerSessionPayload(
  loginId: string,
  password: string
): Promise<{ country: string; companyName: string; contactName: string } | null> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEET_ID is not set");
  }

  const sheets = createSheetsClient();
  const range = `'${WHOLESALER_SHEET_NAME.replace(/'/g, "''")}'!A:E`;

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const values = (res.data.values ?? []) as Cell[][];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (!row) continue;

    if (cellExactString(row[2]) !== loginId || cellExactString(row[3]) !== password) {
      continue;
    }

    const country = cellString(row[0]);
    if (!ALLOWED_LOGIN_COUNTRIES.has(country)) {
      return null;
    }

    return {
      country,
      companyName: cellString(row[1]),
      contactName: cellString(row[4]),
    };
  }

  return null;
}

const COUNTRY_PRODUCT_PRICE_COLUMN: Record<
  string,
  { colIndex: number; currency: "HKD" | "CNY" | "THB" }
> = {
  香港: { colIndex: 6, currency: "HKD" },
  中国: { colIndex: 7, currency: "CNY" },
  タイ: { colIndex: 8, currency: "THB" },
};

/** API 返却用（原価・他国価格は含めない） */
export type ProductListItemPublic = {
  id: string;
  name: string;
  price: string;
  currency: "HKD" | "CNY" | "THB";
};

/**
 * 「製品リスト」を読み、指定国向けの価格列（G/H/I）だけを返す。1行目はヘッダーとしてスキップ。
 * C〜F列（原価・他地域の日本円価格など）はレスポンスに含めない。
 */
export async function readProductListForCountry(country: string): Promise<ProductListItemPublic[]> {
  const mapping = COUNTRY_PRODUCT_PRICE_COLUMN[country];
  if (!mapping) {
    throw new Error("Unsupported country for product list");
  }

  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEET_ID is not set");
  }

  const sheets = createSheetsClient();
  const range = `'${PRODUCT_SHEET_NAME.replace(/'/g, "''")}'!${PRODUCT_LIST_DATA_RANGE}`;

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const values = (res.data.values ?? []) as Cell[][];
  const items: ProductListItemPublic[] = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (!row) continue;

    const id = cellString(row[0]);
    if (!id) continue;

    const name = cellString(row[1]);
    const price = cellString(row[mapping.colIndex] ?? "");

    items.push({
      id,
      name,
      price,
      currency: mapping.currency,
    });
  }

  return items;
}
