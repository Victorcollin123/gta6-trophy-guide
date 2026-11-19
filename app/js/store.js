// store.js — saved progress: localStorage, export and import.
//
// One key holds everything the tracker needs: the earned trophy names and
// the spoiler setting. Export writes the same shape to a file; import reads
// a file back and keeps only names this guide knows.

export const STORE_KEY = "leonida-trophy-guide-v1";

// The fresh state for a first visit: nothing earned yet, spoilers hidden.
// Every recovery path in loadSavedProgress returns this same shape, so the
// rest of the app can always rely on `earned` being an array of strings
// and `spoilerHidden` being a boolean.
export function defaultProgress() {
  return { earned: [], spoilerHidden: true };
}

export function loadSavedProgress() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw);
    return {
      earned: Array.isArray(parsed.earned) ? parsed.earned.filter((n) => typeof n === "string") : [],
      spoilerHidden: parsed.spoilerHidden !== false,
    };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(state) {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

export function isEarned(state, trophy) {
  return state.earned.includes(trophy.name);
}

export function toggleEarned(state, trophy) {
  const earned = new Set(state.earned);
  if (earned.has(trophy.name)) earned.delete(trophy.name);
  else earned.add(trophy.name);
  return { ...state, earned: [...earned] };
}

export function earnedCount(state) {
  return state.earned.length;
}

export function exportProgress(state, trophies) {
  const payload = {
    app: "leonida-trophy-guide",
    version: 1,
    exportedAt: new Date().toISOString(),
    earned: trophies.filter((t) => state.earned.includes(t.name)).map((t) => t.name),
    total: trophies.length,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "leonida-trophy-progress.json";
  link.click();
  URL.revokeObjectURL(url);
  return payload.earned.length;
}

export function parseImportedProgress(text, trophies) {
  const parsed = JSON.parse(text);
  const names = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(names)) throw new Error("file holds no earned list");
  const known = new Set(trophies.map((t) => t.name));
  const kept = names.filter((n) => typeof n === "string" && known.has(n));
  return [...new Set(kept)];
}
