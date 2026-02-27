import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "ve_token";

export type AuthTokenPayload = {
  sub: string; // userId
  sid: string; // sessionId
  wid?: string; // active workspace id
};

function secretKey() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET is missing. Set it in .env");
  return new TextEncoder().encode(s);
}

export function authCookieName() {
  return COOKIE_NAME;
}

export async function signAuthToken(payload: AuthTokenPayload, expiresInSeconds: number) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInSeconds)
    .sign(secretKey());
}

export async function verifyAuthToken(token: string) {
  const { payload } = await jwtVerify<AuthTokenPayload>(token, secretKey(), { algorithms: ["HS256"] });
  return payload;
}
