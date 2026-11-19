// The roadmap to the platinum: nine stages built from the official trophy
// descriptions alone — which story chapters and missions, which collectibles
// and counts, in what order. Each stage lists its trophies and how many of
// them are already earned.
export const ROADMAP_STAGES = [
  {
    stage: 1,
    title: 'Play the story, Chapters 1 to 5',
    text: 'Finish the campaign first. The chapter trophies, the named-mission trophies and the five vague story trophies all land here, along with the gold for the final mission. Keep a manual save at the start of every chapter — there is no mission replay — and meditate at Lucia’s balcony spot in Chapter 1 before the chapter ends.',
    ids: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 47, 48, 49, 50],
  },
  {
    stage: 2,
    title: 'Side-character finales',
    text: 'Finish the mission strands for Andy, Kenton, Billy, Randy and Tyrone, plus Bret’s unique-animal hunt. Each strand ends with one trophy. They unlock as the story progresses, so check back for their markers between chapters.',
    ids: [22, 23, 24, 26, 27, 29],
  },
  {
    stage: 3,
    title: 'Strangers & Freaks',
    text: 'Complete eight full stranger mission strands across Leonida. Follow the stranger markers and finish each strand to its end — a first mission alone does not count.',
    ids: [25],
  },
  {
    stage: 4,
    title: 'Explore Leonida',
    text: 'Reveal all 52 areas of the map, meditate at all 18 spots, use WAiNK It at 100 locations and discover 100 vehicles. One sweep of each region earns progress on all four at once — and the meditation spots include the one possibly missable trophy, so do not leave Chapter 1 behind without its balcony spot.',
    ids: [28, 31, 35, 42],
  },
  {
    stage: 5,
    title: 'Races and stunts',
    text: 'Win 20 different races, win a Top Fun drone race at all 14 venues, and land 250 stunts. Any 250 of the 397 stunts count, so skip the ones you hate.',
    ids: [15, 18, 19],
  },
  {
    stage: 6,
    title: 'Shooting, games and driving skills',
    text: 'Try all nine activity types, gold all 42 Shooting Range challenges, beat Cal at fishing, finish an arcade game, take down five enemies in one Combat Focus, bowl at Kolt & Associates and land the melee drive-by. The shooting range golds are the hardest work in this stage.',
    ids: [16, 17, 20, 21, 36, 46, 51],
  },
  {
    stage: 7,
    title: 'Robberies and wanted levels',
    text: 'Rob five of the eight bank vaults, an armored truck, a jewelry store unseen, three shops in a row with your partner, and one illegal operation per gang — and lose a four-star wanted level with your partner. Vaults open with an optional Chapter 4 mission and always bring four stars, so plan every escape first.',
    ids: [33, 34, 37, 38, 39, 40, 41, 43],
  },
  {
    stage: 8,
    title: 'Collectibles, money and the one-offs',
    text: 'Complete three card sets, buy all eight garages, register ten vehicles with Scooter Bros, spend $100,000 across the shops, and pick up the two Ocean Beach one-offs. The garages double as storage for the vehicles you register.',
    ids: [30, 44, 45, 53, 54, 55],
  },
  {
    stage: 9,
    title: 'Cleanup and 100%',
    text: 'Finish the last 50 challenges, launder the final $250,000 in Marked Bills, and push the in-game 100% checklist to full. When A Long Road pops, the platinum follows immediately — this is where the run ends.',
    ids: [14, 32, 52, 1],
  },
];

export function renderRoadmap(listEl, trophies, earned) {
  listEl.replaceChildren();
  const byId = new Map(trophies.map((t) => [t.id, t]));
  for (const stage of ROADMAP_STAGES) {
    const item = document.createElement('li');
    const stageTrophies = stage.ids.map((id) => byId.get(id)).filter(Boolean);
    const earnedCount = stageTrophies.filter((t) => earned.has(t.name)).length;
    if (earnedCount === stageTrophies.length) item.classList.add('done');

    const heading = document.createElement('h3');
    const num = document.createElement('span');
    num.className = 'stage-num';
    num.textContent = stage.stage;
    heading.append(num, document.createTextNode(stage.title));
    item.append(heading);

    const body = document.createElement('p');
    body.textContent = stage.text;
    item.append(body);

    const names = document.createElement('p');
    names.className = 'stage-trophies';
    names.textContent = stageTrophies.map((t) => t.name).join(' · ');
    item.append(names);

    const count = document.createElement('p');
    count.className = 'stage-count';
    count.textContent = `${earnedCount} of ${stageTrophies.length} earned in this stage`;
    item.append(count);

    listEl.append(item);
  }
}
