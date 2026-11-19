// Filtering for the trophy checklist: one pure function, so the list, the
// missables view and the counts all agree on what "visible" means.

export function visibleTrophies(trophies, options) {
  const query = (options.search || '').trim().toLowerCase();
  return trophies.filter((trophy) => {
    if (options.kind !== 'all' && trophy.kind !== options.kind) return false;
    if (options.grade !== 'all' && trophy.grade !== options.grade) return false;
    if (options.status === 'earned' && !options.earned.has(trophy.id)) return false;
    if (options.status === 'unearned' && options.earned.has(trophy.id)) return false;
    if (query) {
      const haystack = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function spoilerMasked(trophy, spoilersOn, earned) {
  // The spoiler setting hides story trophies until they are earned.
  return spoilersOn && trophy.kind === 'story' && !earned.has(trophy.id);
}

export function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

export function kindLabel(kind) {
  return kind === 'platinum' ? 'Platinum' : kind.charAt(0).toUpperCase() + kind.slice(1);
}
