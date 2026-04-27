// TODO: Replace mock implementation with real API calls when backend is ready
// Real login  → POST /auth/login  (server sets HttpOnly cookie)
// Real logout → POST /auth/logout (server clears cookie)

const MOCK_DELAY = 800;
const COOKIE_NAME = 'sgx_mock_auth';

// Cookies are domain-scoped (not port-scoped), so localhost:3000, :3001, :3002 all share them.
// This mirrors how HttpOnly session cookies behave in production.
const setAuthCookie = (user: AuthUser) => {
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(user))}; path=/; SameSite=Lax`;
};

const clearAuthCookie = () => {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
};

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export const login = async (payload: LoginPayload): Promise<AuthUser> => {
  await new Promise((r) => setTimeout(r, MOCK_DELAY));
  if (!payload.email || !payload.password) {
    throw new Error('Email and password are required.');
  }
  const user: AuthUser = { id: '1', email: payload.email, name: 'SGX User' };
  setAuthCookie(user);
  return user;
};

export const logout = async (): Promise<void> => {
  await new Promise((r) => setTimeout(r, 200));
  clearAuthCookie();
};
