// filters.js — search, kind and grade filters, and the spoiler rule.
//
// The spoiler setting hides the name and description of a hidden trophy
// until it is earned. Nothing else is ever hidden: grades, kinds and counts
// stay visible so the list still reads as a checklist.

export function spoilerMasks(trophy, state) {
  return state.spoilerHidden && trophy.hidden && !state.earned.includes(trophy.name);
}

export function displayName(trophy, state) {
  return spoilerMasks(trophy, state) ? "Hidden trophy" : trophy.name;
}

export function displayDescription(trophy, state) {
  return spoilerMasks(trophy, state)
    ? "Hidden until earned — its name and description stay secret on PlayStation too."
    : trophy.description;
}

export function applyFilters(trophies, state, query) {
  const needle = query.search.trim().toLowerCase();
  return trophies.filter((trophy) => {
    if (query.kind !== "all" && trophy.kind !== query.kind) return false;
    if (query.grade !== "all" && trophy.grade !== query.grade) return false;
    const earned = state.earned.includes(trophy.name);
    if (query.earned === "earned" && !earned) return false;
    if (query.earned === "remaining" && earned) return false;
    if (needle) {
      const haystack = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });
}

export function countByGrade(trophies, state) {
  const counts = { platinum: [0, 0], gold: [0, 0], silver: [0, 0], bronze: [0, 0] };
  for (const trophy of trophies) {
    const slot = counts[trophy.grade];
    if (!slot) continue;
    slot[1] += 1;
    if (state.earned.includes(trophy.name)) slot[0] += 1;
  }
  return counts;
}
