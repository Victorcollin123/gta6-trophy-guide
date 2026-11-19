// data.js — loads the trophy list and gives every trophy a stable id.
//
// The list lives in data/trophies.json under app/; the app fetches that one
// local file at run time and nothing else. The path is relative to the page,
// so it resolves to data/trophies.json from index.html at the app root.
// No network is involved.
export const TROPHY_DATA_URL = "data/trophies.json";

export async function loadTrophies() {
  const response = await fetch(TROPHY_DATA_URL);
  if (!response.ok) throw new Error(`could not load ${TROPHY_DATA_URL}`);
  const payload = await response.json();
  const items = Array.isArray(payload) ? payload : payload.trophies;
  return items.map((trophy, index) => ({ ...trophy, id: `trophy-${index + 1}` }));
}

export function trophyById(trophies, id) {
  return trophies.find((trophy) => trophy.id === id) ?? null;
}

export function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}
