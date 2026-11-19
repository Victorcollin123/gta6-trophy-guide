// Saved progress for the Leonida Trophy Guide: a set of earned trophy names
// kept in localStorage, with export to a file and import back.
const STORAGE_KEY = 'leonida-trophy-progress-v1';
const SETTINGS_KEY = 'leonida-trophy-settings-v1';

// The thirteen trophies the ?seed=13 demo seeds as earned, so the guide's
// screenshots show real progress. Only used when no progress is saved yet.
export const SEED_EARNED = [
  'Just Like Paradise',
  'Paradise Lost',
  'Baited My Tackle',
  'Stick Fiddler',
  'Hot Together',
  'Gunslinger',
  'Catch Me If You Can',
  'In The Beginning…',
  'Let’s Go Bowling',
  'Ten Pin',
  'Treat Yo Self',
  'Personal Best',
  'Bad Luck, I Guess',
];

export function loadEarned() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed.filter((n) => typeof n === 'string') : []);
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort()));
}

export function toggleEarned(earned, name) {
  if (earned.has(name)) earned.delete(name);
  else earned.add(name);
  saveEarned(earned);
  return earned;
}

export function resetEarned() {
  localStorage.removeItem(STORAGE_KEY);
  return new Set();
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function seedEarnedIfFresh() {
  if (localStorage.getItem(STORAGE_KEY) !== null) return false;
  const seeded = new Set(SEED_EARNED);
  saveEarned(seeded);
  return true;
}

export function exportProgress(earned) {
  const blob = new Blob(
    [JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned].sort() }, null, 2)],
    { type: 'application/json' },
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'gta6-trophy-progress.json';
  link.click();
  URL.revokeObjectURL(url);
}

export async function importProgressFile(file, knownNames) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const names = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(names)) throw new Error('That file holds no earned list.');
  const known = new Set(knownNames);
  const earned = new Set(names.filter((n) => typeof n === 'string' && known.has(n)));
  saveEarned(earned);
  return earned;
}
