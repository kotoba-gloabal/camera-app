import { createSheetsClient } from "@/lib/google";

const PRODUCT_SHEET_NAME = "製品リスト";
const TEST_RANGE = "A1:J5";

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
