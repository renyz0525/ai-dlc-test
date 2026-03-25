interface JwtPayload {
  sub: string;
  storeId: string;
  exp: number;
  iat: number;
}

export function decodeToken(token: string): JwtPayload {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT token');
  }
  const payload = parts[1];
  const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
  return JSON.parse(decoded);
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeToken(token);
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export function getTokenRemainingTime(token: string): number {
  try {
    const payload = decodeToken(token);
    const remaining = payload.exp * 1000 - Date.now();
    return remaining > 0 ? remaining : 0;
  } catch {
    return 0;
  }
}
