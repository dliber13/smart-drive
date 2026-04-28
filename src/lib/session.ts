import crypto from "crypto";

const SESSION_SECRET = process.env.SESSION_SECRET!;

export function signSession(data: object): string {
  const payload = JSON.stringify(data);
  const hmac = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
  return `${Buffer.from(payload).toString("base64")}.${hmac}`;
}

export function verifySession(token: string): object | null {
  try {
    const dotIndex = token.lastIndexOf(".");
    if (dotIndex === -1) return null;
    const payloadB64 = token.substring(0, dotIndex);
    const hmac = token.substring(dotIndex + 1);
    const payload = Buffer.from(payloadB64, "base64").toString("utf8");
    const expectedHmac = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(hmac, "hex"), Buffer.from(expectedHmac, "hex"))) return null;
    return JSON.parse(payload);
  } catch {
    return null;
  }
}
