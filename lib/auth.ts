import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE_NAME = "camera_session";

export type SessionPayload = {
  country: string;
  companyName: string;
  contactName: string;
};

function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

/**
 * ログイン成功時に Cookie に載せる JWT を発行する（payload に ID/PASS は含めない）。
 */
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({
    country: payload.country,
    companyName: payload.companyName,
    contactName: payload.contactName,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey(), {
      algorithms: ["HS256"],
    });
    const { country, companyName, contactName } = payload;
    if (
      typeof country !== "string" ||
      typeof companyName !== "string" ||
      typeof contactName !== "string"
    ) {
      return null;
    }
    return { country, companyName, contactName };
  } catch {
    return null;
  }
}

export function sessionCookieOptions(): {
  httpOnly: true;
  secure: boolean;
  sameSite: "lax";
  path: string;
  maxAge: number;
} {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}
