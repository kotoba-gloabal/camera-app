import { createSheetsClient } from "@/lib/google";

const PRODUCT_SHEET_NAME = "製品リスト";
const TEST_RANGE = "A1:J5";

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

export type WholesalerTestRow = {
  country: string;
  buyerName: string;
  hasLoginId: boolean;
  hasPassword: boolean;
  status: string;
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
    buyerName: cellString(row[1]),
    hasLoginId: hasNonEmptyCell(row[2]),
    hasPassword: hasNonEmptyCell(row[3]),
    status: cellString(row[4]),
  }));

  return { headers, rows };
}
