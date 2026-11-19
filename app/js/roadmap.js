// The roadmap to the platinum, built from the official descriptions alone:
// which chapters and missions, which collectibles and counts, in what order.
// Each stage names the trophies it covers by id, so the page can count them.

export const ROADMAP_STAGES = [
  {
    title: 'Play the story, Chapters 1 to 4',
    body: 'Finish Gone Fishing and the four chapters, then the final mission. Twelve story trophies pop as you play, and Chapter 2 is where the list opens up: Jason and Lucia are both playable from there, so side activities, collectibles and stranger strands all unlock.',
    trophyIds: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  },
  {
    title: 'Do the one missable first: meditate in Chapter 1',
    body: 'Positive Mental Attitude is the only trophy reported as possibly missable. Lucia’s first meditation, on the balcony at Jason’s house in Chapter 1, is reported to disappear once that chapter ends, and there is no mission replay. Do it before Chapter 1 ends, then clear the other 17 meditation spots as you explore. Keep a manual save at the start of every chapter.',
    trophyIds: [28],
  },
  {
    title: 'Start every stranger strand as soon as it unlocks',
    body: 'Andy, Kenton, Billy, Randy, Tyrone and Bret each have a mission chain ending in a final mission, and Strangers & Freaks needs any 8 finished strands. One guide warns some chains have windows tied to story progress, so begin them early instead of leaving them until after the credits.',
    trophyIds: [22, 23, 24, 25, 26, 27, 29],
  },
  {
    title: 'Collect as you travel',
    body: 'Cards (any 3 sets for the trophy, 15 for 100%), WAiNK at 100 locations, 100 vehicles scanned, all 52 areas of Leonida explored, and 8 garage properties bought. These are all counted, so the tracker shows your progress; do a little on every trip instead of one long sweep at the end.',
    trophyIds: [30, 31, 35, 42, 54],
  },
  {
    title: 'Activities and grinds',
    body: 'Shooting Range golds (all 42), 250 stunts, drone races at all 14 locations, 20 different race wins, 50 challenges, the partner robberies and escapes, 5 bank vaults, 9 gang operations, and the money trophies: $250,000 of laundered Marked Bills and $100,000 spent in shops. Most of these build naturally while you play; the tracker’s counts show what is left.',
    trophyIds: [14, 15, 16, 17, 18, 19, 20, 21, 32, 33, 34, 36, 37, 38, 39, 40, 41, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 55],
  },
  {
    title: 'Clean up, then 100%',
    body: 'Open the in-game checklist (Progress, then Stats, then 100% Completion) once the story is done. Earlier progress counts and nothing on it is missable, so it is a mop-up list, not a second playthrough. A Long Road, the gold for 100%, is the hardest trophy in the set; when it pops, the platinum follows.',
    trophyIds: [14, 1],
  },
];

export function renderRoadmap(container, trophiesById, earned) {
  container.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const item = document.createElement('li');
    const heading = document.createElement('h3');
    heading.textContent = stage.title;
    const body = document.createElement('p');
    body.textContent = stage.body;
    const done = stage.trophyIds.filter((id) => earned.has(id)).length;
    const names = document.createElement('p');
    names.className = 'stage-trophies';
    names.textContent = `${done}/${stage.trophyIds.length} earned in this stage — ${stage.trophyIds.map((id) => trophiesById.get(id).name).join(' · ')}`;
    item.append(heading, body, names);
    container.append(item);
  }
}
