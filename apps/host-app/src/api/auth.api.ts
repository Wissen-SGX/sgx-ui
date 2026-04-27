// TODO: Replace mock with GET /auth/me — server reads the HttpOnly session cookie
// and returns the current user or 401 if unauthenticated.

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

const readAuthCookie = (): AuthUser | null => {
  const match = document.cookie.match(/(^|;\s*)sgx_mock_auth=([^;]+)/);
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[2])) as AuthUser;
  } catch {
    return null;
  }
};

export const fetchCurrentUser = async (): Promise<AuthUser | null> => {
  return readAuthCookie();
};
