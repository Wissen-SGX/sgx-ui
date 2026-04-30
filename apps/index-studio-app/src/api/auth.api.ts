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

// Async — used by the router loader; swap body for GET /auth/me when backend is ready.
export const fetchCurrentUser = async (): Promise<AuthUser | null> => {
  return readAuthCookie();
};

// Sync — used for display purposes only (e.g. showing user initials in the header).
export const getCurrentUser = (): AuthUser | null => readAuthCookie();

// TODO: Replace with POST /auth/logout when backend is ready.
export const logout = async (): Promise<void> => {
  document.cookie = 'sgx_mock_auth=; path=/; max-age=0';
};
