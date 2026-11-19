// Filtering for the trophy checklist: by kind, grade, search text, earned-only,
// and the spoiler setting, which hides the names and descriptions of story
// trophies that are still hidden on PlayStation until they are earned.
export const KIND_LABELS = {
  story: 'Story',
  missable: 'Missable',
  collectibles: 'Collectibles',
  activities: 'Activities',
  completion: 'Completion',
  online: 'Online',
};

export const KIND_ORDER = ['story', 'missable', 'collectibles', 'activities', 'completion', 'online'];

export function spoilerMasks(trophy, earned, spoilersOn) {
  if (!spoilersOn) return false;
  if (earned.has(trophy.name)) return false;
  return trophy.hidden === true;
}

export function displayName(trophy, earned, spoilersOn) {
  return spoilerMasks(trophy, earned, spoilersOn) ? 'Hidden trophy' : trophy.name;
}

export function displayDescription(trophy, earned, spoilersOn) {
  if (spoilerMasks(trophy, earned, spoilersOn)) {
    return 'Hidden until earned — PlayStation keeps this trophy secret until you unlock it.';
  }
  return trophy.description;
}

export function filterTrophies(trophies, earned, filters) {
  const query = (filters.query || '').trim().toLowerCase();
  return trophies.filter((trophy) => {
    if (filters.kind !== 'all') {
      if (filters.kind === 'online') return false;
      if (filters.kind === 'missable' && !trophy.missable) return false;
      if (filters.kind !== 'missable' && trophy.kind !== filters.kind) return false;
    }
    if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
    if (filters.earnedOnly && !earned.has(trophy.name)) return false;
    if (query) {
      const haystack = `${trophy.name} ${trophy.description} ${trophy.guide} ${trophy.kind}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function gradeCounts(trophies, earned) {
  const counts = {};
  for (const trophy of trophies) {
    counts[trophy.grade] = counts[trophy.grade] || { earned: 0, total: 0 };
    counts[trophy.grade].total += 1;
    if (earned.has(trophy.name)) counts[trophy.grade].earned += 1;
  }
  return counts;
}

export function nextUnearned(trophies, earned) {
  const order = ['story', 'missable', 'activities', 'collectibles', 'completion'];
  const sorted = [...trophies].sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind) || a.id - b.id);
  return sorted.find((trophy) => !earned.has(trophy.name)) || null;
}
