// The missables page: only one trophy on the whole list is possibly missable,
// and this module renders its card from the trophy data itself, so the page
// can never drift from the list.
export function renderMissables(container, trophies, earned) {
  container.replaceChildren();
  const missable = trophies.filter((t) => t.missable);
  if (missable.length === 0) {
    const none = document.createElement('p');
    none.textContent = 'No trophy on this list is missable.';
    container.append(none);
    return;
  }
  for (const trophy of missable) {
    const card = document.createElement('article');
    card.className = 'missable-card';

    const title = document.createElement('h3');
    title.textContent = trophy.name;
    card.append(title);

    const desc = document.createElement('p');
    desc.textContent = trophy.description;
    card.append(desc);

    const guide = document.createElement('p');
    guide.textContent = trophy.guide;
    card.append(guide);

    const status = document.createElement('p');
    status.className = 'stage-count';
    status.textContent = earned.has(trophy.name)
      ? 'Earned — the missable window has passed safely.'
      : `Not earned yet — ${trophy.target} spots to meditate at, including the Chapter 1 balcony spot.`;
    card.append(status);

    container.append(card);
  }

  const rest = document.createElement('p');
  rest.textContent = 'Every other trophy unlocks in a single playthrough or can be cleaned up after the story. The chapter and mission trophies come from playing the story, the side-character finales from finishing their strands, and the rest from activities, collectibles and robberies that stay open after the credits.';
  container.append(rest);
}
