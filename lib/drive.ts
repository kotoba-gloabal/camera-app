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
  folderId: string,
  pageSize = 100
): Promise<DriveImageFile[]> {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
    fields: "files(id, name, mimeType)",
    pageSize,
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

async function listFirstImageFileIdInFolder(
  drive: drive_v3.Drive,
  folderId: string
): Promise<string | null> {
  const images = await listImageFilesInFolder(drive, folderId, 1);
  return images[0]?.id ?? null;
}

/** 同一 HTTP リクエスト内での Drive フォルダ検索結果を再利用する */
export class DriveLookupCache {
  private readonly drive: drive_v3.Drive;
  private readonly rootFolderId: string;
  private readonly auctionFolders = new Map<string, string | null>();
  private readonly roundFolders = new Map<string, string | null>();
  private readonly productFolders = new Map<string, string | null>();
  private readonly folderFirstImage = new Map<string, string | null>();
  private readonly auctionPending = new Map<string, Promise<string | null>>();
  private readonly roundPending = new Map<string, Promise<string | null>>();
  private readonly productPending = new Map<string, Promise<string | null>>();
  private readonly firstImagePending = new Map<string, Promise<string | null>>();

  constructor(drive?: drive_v3.Drive, rootFolderId?: string) {
    const resolvedRoot = rootFolderId ?? process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
    if (!resolvedRoot) {
      throw new Error("GOOGLE_DRIVE_ROOT_FOLDER_ID is not set");
    }
    this.drive = drive ?? createDriveClient();
    this.rootFolderId = resolvedRoot;
  }

  private async getAuctionFolderId(auctionName: string): Promise<string | null> {
    if (this.auctionFolders.has(auctionName)) {
      return this.auctionFolders.get(auctionName) ?? null;
    }
    let pending = this.auctionPending.get(auctionName);
    if (!pending) {
      pending = findChildFolder(this.drive, this.rootFolderId, auctionName).then((id) => {
        this.auctionFolders.set(auctionName, id);
        return id;
      });
      this.auctionPending.set(auctionName, pending);
    }
    return pending;
  }

  private async getRoundFolderId(
    auctionFolderId: string,
    roundFolderName: string
  ): Promise<string | null> {
    const key = `${auctionFolderId}/${roundFolderName}`;
    if (this.roundFolders.has(key)) {
      return this.roundFolders.get(key) ?? null;
    }
    let pending = this.roundPending.get(key);
    if (!pending) {
      pending = findChildFolder(this.drive, auctionFolderId, roundFolderName).then((id) => {
        this.roundFolders.set(key, id);
        return id;
      });
      this.roundPending.set(key, pending);
    }
    return pending;
  }

  private async getProductFolderId(
    roundFolderId: string,
    productFolderName: string
  ): Promise<string | null> {
    const key = `${roundFolderId}/${productFolderName}`;
    if (this.productFolders.has(key)) {
      return this.productFolders.get(key) ?? null;
    }
    let pending = this.productPending.get(key);
    if (!pending) {
      pending = findChildFolder(this.drive, roundFolderId, productFolderName).then((id) => {
        this.productFolders.set(key, id);
        return id;
      });
      this.productPending.set(key, pending);
    }
    return pending;
  }

  private async getFirstImageFileId(productFolderId: string): Promise<string | null> {
    if (this.folderFirstImage.has(productFolderId)) {
      return this.folderFirstImage.get(productFolderId) ?? null;
    }
    let pending = this.firstImagePending.get(productFolderId);
    if (!pending) {
      pending = listFirstImageFileIdInFolder(this.drive, productFolderId).then((id) => {
        this.folderFirstImage.set(productFolderId, id);
        return id;
      });
      this.firstImagePending.set(productFolderId, pending);
    }
    return pending;
  }

  /** 商品IDの1枚目画像 fileId を返す。失敗時は null（一覧全体は落とさない） */
  async getProductThumbnailFileId(productId: string): Promise<string | null> {
    try {
      const parsed = parseProductId(productId);
      const auctionFolderId = await this.getAuctionFolderId(parsed.auctionName);
      if (!auctionFolderId) return null;

      const roundFolderId = await this.getRoundFolderId(auctionFolderId, parsed.roundFolderName);
      if (!roundFolderId) return null;

      const productFolderId = await this.getProductFolderId(
        roundFolderId,
        parsed.productFolderName
      );
      if (!productFolderId) return null;

      return this.getFirstImageFileId(productFolderId);
    } catch {
      return null;
    }
  }
}

export function createDriveLookupCache(): DriveLookupCache {
  return new DriveLookupCache();
}

/**
 * 複数商品のサムネイル fileId を同一リクエスト内キャッシュ付きで取得する。
 */
export async function getProductThumbnailFileIds(
  productIds: string[],
  cache = createDriveLookupCache()
): Promise<Map<string, string | null>> {
  const results = await Promise.all(
    productIds.map(async (id) => [id, await cache.getProductThumbnailFileId(id)] as const)
  );
  return new Map(results);
}

/** 商品IDの Drive フォルダ内の全画像 fileId を返す。失敗時は空配列 */
export async function getProductImageFileIds(productId: string): Promise<string[]> {
  try {
    const result = await findProductDriveImages(productId);
    return result.images.map((image) => image.id);
  } catch {
    return [];
  }
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

export class DriveImageNotFoundError extends Error {
  constructor() {
    super("Image not found");
    this.name = "DriveImageNotFoundError";
  }
}

export type DriveImageContent = {
  data: Buffer;
  mimeType: string;
};

function isDriveNotFoundError(err: unknown): boolean {
  if (typeof err === "object" && err !== null && "code" in err) {
    return (err as { code: number }).code === 404;
  }
  return false;
}

/**
 * Google Drive 上の画像ファイル本体を取得する（alt=media）。
 */
export async function getDriveImageContent(fileId: string): Promise<DriveImageContent> {
  const drive = createDriveClient();

  let mimeType: string | null | undefined;
  let trashed: boolean | null | undefined;

  try {
    const metaRes = await drive.files.get({
      fileId,
      fields: "mimeType, trashed",
      supportsAllDrives: true,
    });
    mimeType = metaRes.data.mimeType;
    trashed = metaRes.data.trashed ?? false;
  } catch (err) {
    if (isDriveNotFoundError(err)) {
      throw new DriveImageNotFoundError();
    }
    throw err;
  }

  if (trashed || !mimeType || !mimeType.startsWith("image/")) {
    throw new DriveImageNotFoundError();
  }

  try {
    const mediaRes = await drive.files.get(
      {
        fileId,
        alt: "media",
        supportsAllDrives: true,
      },
      { responseType: "arraybuffer" }
    );

    return {
      data: Buffer.from(mediaRes.data as ArrayBuffer),
      mimeType,
    };
  } catch (err) {
    if (isDriveNotFoundError(err)) {
      throw new DriveImageNotFoundError();
    }
    throw err;
  }
}
