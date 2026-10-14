import { getStoredToken } from "@/lib/auth";

const LOCAL_KEY = "fti_landing_open";

export async function fetchLandingOpen(): Promise<boolean> {
  try {
    const res = await fetch("/api/settings.php", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { landingOpen?: boolean };
      if (typeof data.landingOpen === "boolean") {
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_KEY, data.landingOpen ? "1" : "0");
        }
        return data.landingOpen;
      }
    }
  } catch {
    // local fallback
  }

  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw === "0") return false;
    if (raw === "1") return true;
  }
  return true;
}

export async function setLandingOpen(open: boolean): Promise<{ ok: boolean; error?: string }> {
  const token = getStoredToken();

  try {
    const res = await fetch("/api/settings.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}`, "X-FTI-Token": token } : {}),
      },
      body: JSON.stringify({ landingOpen: open }),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string; landingOpen?: boolean };
    if (res.ok && data.ok) {
      localStorage.setItem(LOCAL_KEY, open ? "1" : "0");
      return { ok: true };
    }
    // If PHP unavailable (local), still allow admin toggle in browser storage
    if (!res.ok && token) {
      // fall through
    } else if (data.error) {
      // try local admin fallback below
    }
  } catch {
    // local fallback
  }

  // Local next-dev fallback for seeded admin session
  if (typeof window !== "undefined" && (token || localStorage.getItem("fti_auth_user"))) {
    localStorage.setItem(LOCAL_KEY, open ? "1" : "0");
    return { ok: true };
  }

  return { ok: false, error: "Could not update store setting." };
}
