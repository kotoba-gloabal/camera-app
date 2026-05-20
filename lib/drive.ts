import type { drive_v3 } from "googleapis";
import { createDriveClient } from "@/lib/google";

const AUCTION_NAME_BY_CODE: Record<string, string> = {
  V: "VCA",
  P: "PANDA",
};

export type ParsedProductId = {
  auctionCode: string;
  auctionName: string;
  round: string;
  roundFolderName: string;
  productFolderName: string;
};

export type DriveImageFile = {
  id: string;
  name: string;
  mimeType: string;
};

export type ProductDriveLookupResult = {
  productId: string;
  parsed: ParsedProductId;
  folders: {
    rootFolderId: string;
    auctionFolderId: string;
    roundFolderId: string;
    productFolderId: string;
  };
  images: DriveImageFile[];
  imageCount: number;
};

/** Drive API の q 用にファイル名をエスケープする */
function escapeDriveQueryString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

export function parseProductId(productId: string): ParsedProductId {
  const trimmed = productId.trim();
  const match = /^([VP])(\d+)-(.+)$/.exec(trimmed);
  if (!match) {
    throw new Error(`Invalid product ID format: ${productId}`);
  }

  const [, auctionCode, round, productFolderName] = match;
  const auctionName = AUCTION_NAME_BY_CODE[auctionCode];
  if (!auctionName) {
    throw new Error(`Unsupported auction code: ${auctionCode}`);
  }

  return {
    auctionCode,
    auctionName,
    round,
    roundFolderName: `第${round}回`,
    productFolderName,
  };
}

async function findChildFolder(
  drive: drive_v3.Drive,
  parentId: string,
  folderName: string
): Promise<string | null> {
  const escapedName = escapeDriveQueryString(folderName);
  const res = await drive.files.list({
    q: `'${parentId}' in parents and name = '${escapedName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id, name)",
    pageSize: 1,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  return res.data.files?.[0]?.id ?? null;
}

async function listImageFilesInFolder(
  drive: drive_v3.Drive,
  folderId: string
): Promise<DriveImageFile[]> {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
    fields: "files(id, name, mimeType)",
    pageSize: 100,
    orderBy: "name",
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  const files = res.data.files ?? [];
  return files
    .filter(
      (file): file is { id: string; name: string; mimeType: string } =>
        typeof file.id === "string" &&
        typeof file.name === "string" &&
        typeof file.mimeType === "string" &&
        file.mimeType.startsWith("image/")
    )
    .map((file) => ({
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
    }));
}

/**
 * 商品IDから Drive 上の商品フォルダを辿り、画像ファイルのメタデータのみ返す。
 */
export async function findProductDriveImages(
  productId: string
): Promise<ProductDriveLookupResult> {
  const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
  if (!rootFolderId) {
    throw new Error("GOOGLE_DRIVE_ROOT_FOLDER_ID is not set");
  }

  const parsed = parseProductId(productId);
  const drive = createDriveClient();

  const auctionFolderId = await findChildFolder(drive, rootFolderId, parsed.auctionName);
  if (!auctionFolderId) {
    throw new Error(`Auction folder not found: ${parsed.auctionName}`);
  }

  const roundFolderId = await findChildFolder(drive, auctionFolderId, parsed.roundFolderName);
  if (!roundFolderId) {
    throw new Error(`Round folder not found: ${parsed.roundFolderName}`);
  }

  const productFolderId = await findChildFolder(
    drive,
    roundFolderId,
    parsed.productFolderName
  );
  if (!productFolderId) {
    throw new Error(`Product folder not found: ${parsed.productFolderName}`);
  }

  const images = await listImageFilesInFolder(drive, productFolderId);

  return {
    productId: productId.trim(),
    parsed,
    folders: {
      rootFolderId,
      auctionFolderId,
      roundFolderId,
      productFolderId,
    },
    images,
    imageCount: images.length,
  };
}
