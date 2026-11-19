// The per-trophy detail pane: the official name, description and grade, the
// guide in our own words, its cited sources, the missable flag, the difficulty
// hint and the PSN progress count where PlayStation tracks one.
import { displayDescription, spoilerMasks } from './filters.js';

export function renderDetailPane(pane, trophy, earned, spoilersOn) {
  pane.replaceChildren();
  if (!trophy) {
    const empty = document.createElement('p');
    empty.className = 'detail-empty';
    empty.textContent = 'Pick a trophy’s Guide button to read its full guide, sources and difficulty here.';
    pane.append(empty);
    return;
  }

  const masked = spoilerMasks(trophy, earned, spoilersOn);
  const title = document.createElement('h3');
  title.textContent = masked ? 'Hidden trophy' : trophy.name;
  pane.append(title);

  const gradeLine = document.createElement('p');
  gradeLine.className = 'detail-grade';
  const pill = document.createElement('span');
  pill.className = `grade-pill ${trophy.grade}`;
  pill.textContent = trophy.grade;
  gradeLine.append(pill);
  if (trophy.hidden) {
    const tag = document.createElement('span');
    tag.className = 'hidden-tag';
    tag.textContent = 'hidden on PlayStation';
    gradeLine.append(' ', tag);
  }
  if (earned.has(trophy.name)) {
    const tag = document.createElement('span');
    tag.className = 'grade-pill platinum';
    tag.textContent = 'earned';
    gradeLine.append(' ', tag);
  }
  pane.append(gradeLine);

  const desc = document.createElement('p');
  desc.className = 'detail-desc';
  desc.textContent = displayDescription(trophy, earned, spoilersOn);
  pane.append(desc);

  if (trophy.missable) {
    const warn = document.createElement('p');
    warn.className = 'missable-warning';
    warn.textContent = 'Possibly missable — the only trophy on the list that is. See the Missables tab before you play past Chapter 1.';
    pane.append(warn);
  }

  if (trophy.target !== null && trophy.target !== undefined) {
    const target = document.createElement('p');
    target.className = 'target-pill';
    target.textContent = `PlayStation tracks this one: 0/${trophy.target}`;
    pane.append(target);
  }

  const guideHeading = document.createElement('h4');
  guideHeading.textContent = 'Guide';
  pane.append(guideHeading);
  const guide = document.createElement('p');
  guide.className = 'detail-guide';
  guide.textContent = trophy.guide;
  pane.append(guide);

  const difficulty = document.createElement('p');
  difficulty.className = 'difficulty';
  difficulty.textContent = `Difficulty: ${trophy.difficulty}`;
  pane.append(difficulty);

  const sourcesHeading = document.createElement('h4');
  sourcesHeading.textContent = 'Sources';
  pane.append(sourcesHeading);
  const list = document.createElement('ul');
  for (const source of trophy.sources || []) {
    const item = document.createElement('li');
    if (source.url) {
      const link = document.createElement('a');
      link.href = source.url;
      link.textContent = source.name;
      link.rel = 'noopener';
      item.append(link);
    } else {
      item.textContent = source.name;
    }
    list.append(item);
  }
  pane.append(list);

  const note = document.createElement('p');
  note.className = 'difficulty';
  note.textContent = 'Names, descriptions and grades are shown as PlayStation publishes them. Guides are written in our own words for this guide.';
  pane.append(note);
}
