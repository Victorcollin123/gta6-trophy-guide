// Progress persistence for the Leonida Trophy Guide.
// Earned trophy ids live in localStorage under one key. Export writes a JSON
// file; import reads one back. The demo seed is a fixed set of 13 early
// trophies used only when the page is opened with ?demo=1, so screenshots
// show a live-looking tracker.

export const STORAGE_KEY = 'leonida-trophy-guide-earned-v1';

// Thirteen trophies a player would plausibly hold early on: the opening
// mission and Chapter 1, plus a spread of activities and one-off moments.
export const DEMO_EARNED_IDS = [2, 3, 20, 21, 33, 34, 36, 39, 44, 46, 51, 53, 55];

export function loadEarned() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((n) => Number.isInteger(n)));
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
  } catch {
    // Private mode or a full store: progress just does not persist.
  }
}

export function exportProgress(earned) {
  const payload = JSON.stringify(
    { game: 'Grand Theft Auto VI', exported: new Date().toISOString(), earned: [...earned].sort((a, b) => a - b) },
    null,
    2,
  );
  const blob = new Blob([payload], { type: 'application/json' });
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(blob);
  anchor.download = 'leonida-trophy-progress.json';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(anchor.href), 1000);
}

export async function importProgress(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const list = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(list)) throw new Error('That file has no earned-trophy list in it.');
  return new Set(list.filter((n) => Number.isInteger(n)));
}

export function seedDemoIfRequested() {
  const params = new URLSearchParams(location.search);
  if (params.get('demo') !== '1') return null;
  return new Set(DEMO_EARNED_IDS);
}
