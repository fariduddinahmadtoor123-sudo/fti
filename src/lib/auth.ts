export type AuthUser = {
  email: string;
  name: string;
  role: string;
};

const STORAGE_KEY = "fti_auth_user";

/** Seeded member for local Next.js (PHP/MySQL not available in `next dev`). */
export const LOCAL_MEMBER = {
  email: "fariduddinahmadtoor123@gmail.com",
  password: "0987@Asdfmn",
  name: "Farid ud din Ahmad",
  role: "admin",
} as const;

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function storeUser(user: AuthUser) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearUser() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function isLoggedIn(): boolean {
  return Boolean(getStoredUser());
}

export type LoginResult =
  | { ok: true; user: AuthUser }
  | { ok: false; error: string };

export async function login(email: string, password: string): Promise<LoginResult> {
  const normalized = email.trim().toLowerCase();

  // Prefer Hostinger PHP + MySQL when available
  try {
    const res = await fetch("/api/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalized, password }),
    });
    if (res.ok) {
      const data = (await res.json()) as {
        ok?: boolean;
        user?: AuthUser;
        error?: string;
      };
      if (data.ok && data.user) {
        storeUser(data.user);
        return { ok: true, user: data.user };
      }
      if (data.error) return { ok: false, error: data.error };
    }
  } catch {
    // fall through to local seed (next dev / offline)
  }

  if (
    normalized === LOCAL_MEMBER.email &&
    password === LOCAL_MEMBER.password
  ) {
    const user: AuthUser = {
      email: LOCAL_MEMBER.email,
      name: LOCAL_MEMBER.name,
      role: LOCAL_MEMBER.role,
    };
    storeUser(user);
    return { ok: true, user };
  }

  return { ok: false, error: "Invalid email or password." };
}

export function logout() {
  clearUser();
}
