const SESSION_SECRET = process.env.SESSION_SECRET!;

function getSecret(): string {
  if (!SESSION_SECRET) throw new Error("SESSION_SECRET is not set");
  return SESSION_SECRET;
}

export function signSession(data: object): string {
  const payload = JSON.stringify(data);
  const secret = getSecret();
  const crypto = require("crypto");
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${Buffer.from(payload).toString("base64")}.${hmac}`;
}

export function verifySession(token: string): object | null {
  try {
    const secret = getSecret();
    const dotIndex = token.lastIndexOf(".");
    if (dotIndex === -1) return null;
    const payloadB64 = token.substring(0, dotIndex);
    const hmac = token.substring(dotIndex + 1);
    const payload = Buffer.from(payloadB64, "base64").toString("utf8");
    const crypto = require("crypto");
    const expectedHmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    if (hmac.length !== expectedHmac.length) return null;
    let diff = 0;
    for (let i = 0; i < hmac.length; i++) {
      diff |= hmac.charCodeAt(i) ^ expectedHmac.charCodeAt(i);
    }
    if (diff !== 0) return null;
    return JSON.parse(payload);
  } catch {
    return null;
  }
}
