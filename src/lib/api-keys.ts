import crypto from "crypto";

// Creates an API key, returns plaintext key (only once), plus prefix + hash for storage.
export async function createApiKeyPair() {
  const prefix = crypto.randomBytes(4).toString("hex");
  const secret = crypto.randomBytes(24).toString("base64url");
  const apiKey = `ve_${prefix}_${secret}`;
  const hash = crypto.createHash("sha256").update(apiKey).digest("hex");
  return { apiKey, prefix, hash };
}

export function hashApiKey(apiKey: string) {
  return crypto.createHash("sha256").update(apiKey).digest("hex");
}
