import { google } from "googleapis";

const SHEETS_READONLY = "https://www.googleapis.com/auth/spreadsheets.readonly";
const DRIVE_READONLY = "https://www.googleapis.com/auth/drive.readonly";

/**
 * Netlify / dotenv で保存した秘密鍵の `\n` リテラルを PEM 用の改行に戻す。
 */
export function normalizePrivateKeyFromEnv(raw: string): string {
  return raw.replace(/\\n/g, "\n");
}

function getServiceAccountCredentials() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY;

  if (!clientEmail) {
    throw new Error("GOOGLE_CLIENT_EMAIL is not set");
  }
  if (!privateKeyRaw) {
    throw new Error("GOOGLE_PRIVATE_KEY is not set");
  }

  return {
    email: clientEmail,
    key: normalizePrivateKeyFromEnv(privateKeyRaw),
  };
}

/**
 * サービスアカウントで Google Sheets API クライアントを生成する（サーバー専用）。
 */
export function createSheetsClient() {
  const auth = new google.auth.JWT({
    ...getServiceAccountCredentials(),
    scopes: [SHEETS_READONLY],
  });

  return google.sheets({ version: "v4", auth });
}

/**
 * サービスアカウントで Google Drive API クライアントを生成する（サーバー専用）。
 */
export function createDriveClient() {
  const auth = new google.auth.JWT({
    ...getServiceAccountCredentials(),
    scopes: [DRIVE_READONLY],
  });

  return google.drive({ version: "v3", auth });
}
