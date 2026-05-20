import { google } from "googleapis";

const SHEETS_READONLY = "https://www.googleapis.com/auth/spreadsheets.readonly";

/**
 * Netlify / dotenv で保存した秘密鍵の `\n` リテラルを PEM 用の改行に戻す。
 */
export function normalizePrivateKeyFromEnv(raw: string): string {
  return raw.replace(/\\n/g, "\n");
}

/**
 * サービスアカウントで Google Sheets API クライアントを生成する（サーバー専用）。
 */
export function createSheetsClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY;

  if (!clientEmail) {
    throw new Error("GOOGLE_CLIENT_EMAIL is not set");
  }
  if (!privateKeyRaw) {
    throw new Error("GOOGLE_PRIVATE_KEY is not set");
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: normalizePrivateKeyFromEnv(privateKeyRaw),
    scopes: [SHEETS_READONLY],
  });

  return google.sheets({ version: "v4", auth });
}
