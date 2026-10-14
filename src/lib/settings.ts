import { getStoredToken } from "@/lib/auth";

const LOCAL_KEY = "fti_landing_open";

function isLocalHost(): boolean {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1";
}

export async function fetchLandingOpen(): Promise<boolean> {
  try {
    const res = await fetch(`/api/settings.php?t=${Date.now()}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    });
    if (res.ok) {
      const data = (await res.json()) as { landingOpen?: boolean };
      if (typeof data.landingOpen === "boolean") {
        localStorage.setItem(LOCAL_KEY, data.landingOpen ? "1" : "0");
        return data.landingOpen;
      }
    }
  } catch {
    // fall through
  }

  if (isLocalHost()) {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw === "0") return false;
    if (raw === "1") return true;
  }

  // Production: fail-safe open only if API unreachable? Prefer last known.
  const raw = localStorage.getItem(LOCAL_KEY);
  if (raw === "0") return false;
  if (raw === "1") return true;
  return true;
}

export async function setLandingOpen(
  open: boolean
): Promise<{ ok: boolean; error?: string; landingOpen?: boolean }> {
  const token = getStoredToken();
  if (!token || token.startsWith("local-")) {
    if (isLocalHost()) {
      localStorage.setItem(LOCAL_KEY, open ? "1" : "0");
      return { ok: true, landingOpen: open };
    }
    return {
      ok: false,
      error: "Session expired. Please log out, log in again, then use Store Setting.",
    };
  }

  try {
    const res = await fetch("/api/settings.php", {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-FTI-Token": token,
      },
      body: JSON.stringify({ landingOpen: open, token }),
    });
    const data = (await res.json()) as {
      ok?: boolean;
      error?: string;
      landingOpen?: boolean;
    };

    if (res.ok && data.ok && typeof data.landingOpen === "boolean") {
      localStorage.setItem(LOCAL_KEY, data.landingOpen ? "1" : "0");
      // Verify round-trip from server
      const verified = await fetchLandingOpen();
      if (verified !== data.landingOpen) {
        return {
          ok: false,
          error: "Server did not save the setting. Try again.",
        };
      }
      return { ok: true, landingOpen: verified };
    }

    return {
      ok: false,
      error: data.error || "Could not update store setting on server.",
    };
  } catch {
    if (isLocalHost()) {
      localStorage.setItem(LOCAL_KEY, open ? "1" : "0");
      return { ok: true, landingOpen: open };
    }
    return { ok: false, error: "Network error — setting not saved." };
  }
}
