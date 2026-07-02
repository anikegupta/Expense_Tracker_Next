export const getTokenPayload = (token) => {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = typeof window !== "undefined"
      ? atob(payloadBase64)
      : Buffer.from(payloadBase64, "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Invalid JWT token payload:", error);
    return null;
  }
};

export const getTokenExpiryTimestamp = (token) => {
  const payload = getTokenPayload(token);
  if (!payload || typeof payload.exp !== "number") return null;
  return payload.exp * 1000;
};

export const isTokenExpired = (token) => {
  const expiry = getTokenExpiryTimestamp(token);
  if (!expiry) return true;
  return Date.now() >= expiry;
};
