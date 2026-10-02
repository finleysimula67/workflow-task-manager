export interface JwtPayload {
  sub: string; // email
  userId: number;
  username: string;
  roles?: string;
  exp?: number;
  iat?: number;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    return payload as JwtPayload;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token);
  if (!payload || !payload.exp) return true;
  const currentTime = Date.now() / 1000;
  return payload.exp < currentTime;
}

export function getUserFromToken(token: string): any {
  const payload = decodeJwt(token);
  if (!payload) return null;
  return {
    id: payload.userId,
    username: payload.username,
    email: payload.sub,
    roles: payload.roles ? payload.roles.split(',') : ['ROLE_USER']
  };
}
