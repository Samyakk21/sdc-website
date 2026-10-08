"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "sdc-theme";

// The <html> class set by the root layout's inline script (and by toggle()) is
// the source of truth; observing it keeps React in sync without an effect that
// calls setState. The server snapshot is always light — the toggle's own
// appearance catches up right after hydration, while the page itself is already
// painted dark by the pre-paint script.
function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

function storedTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // React's Strict Mode remount in development can clear attributes it does not
  // manage from JSX (including the class the inline script set) — re-apply the
  // stored theme before paint. This only touches the DOM, so no state update.
  useLayoutEffect(() => {
    const stored = storedTheme();
    if (stored) document.documentElement.classList.toggle("dark", stored === "dark");
  }, []);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // Storage unavailable (e.g. private mode) — the theme still applies for this visit.
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        dark ? "bg-brand-600" : "bg-slate-200"
      }`}
    >
      <span
        aria-hidden
        className={`absolute left-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#f8fafc] text-[#334155] shadow transition-transform ${
          dark ? "translate-x-5" : "translate-x-0"
        }`}
      >
        {dark ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
      </span>
    </button>
  );
}
