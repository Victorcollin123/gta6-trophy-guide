// The checklist itself: one row per trophy that passes the filters, with its
// earned checkbox, official name and description (or the spoiler mask), grade,
// kind, PSN count and a Guide button that opens the detail pane.
import { displayDescription, displayName, filterTrophies } from './filters.js';

export function renderTrophyList(listEl, metaEl, emptyNote, trophies, earned, filters, spoilersOn, onToggle, onShowGuide) {
  const visible = filterTrophies(trophies, earned, filters);
  listEl.replaceChildren();
  for (const trophy of visible) {
    const row = document.createElement('li');
    row.className = 'trophy-row';
    if (earned.has(trophy.name)) row.classList.add('earned');

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(trophy.name);
    box.setAttribute('aria-label', `Earned: ${displayName(trophy, earned, spoilersOn)}`);
    box.addEventListener('change', () => onToggle(trophy.name));
    row.append(box);

    const main = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'trophy-name';
    name.textContent = displayName(trophy, earned, spoilersOn);
    if (trophy.hidden && !earned.has(trophy.name)) {
      const tag = document.createElement('span');
      tag.className = 'hidden-tag';
      tag.textContent = 'hidden';
      name.append(tag);
    }
    main.append(name);

    const desc = document.createElement('div');
    desc.className = 'trophy-desc';
    desc.textContent = displayDescription(trophy, earned, spoilersOn);
    main.append(desc);

    const meta = document.createElement('div');
    meta.className = 'trophy-meta';
    const grade = document.createElement('span');
    grade.className = `grade-pill ${trophy.grade}`;
    grade.textContent = trophy.grade;
    meta.append(grade);
    const kind = document.createElement('span');
    kind.className = 'kind-pill';
    kind.textContent = trophy.kind;
    meta.append(kind);
    if (trophy.target !== null && trophy.target !== undefined) {
      const target = document.createElement('span');
      target.className = 'target-pill';
      target.textContent = `0/${trophy.target}`;
      meta.append(target);
    }
    if (trophy.missable) {
      const flag = document.createElement('span');
      flag.className = 'missable-pill';
      flag.textContent = 'possibly missable';
      meta.append(flag);
    }
    main.append(meta);
    row.append(main);

    const guideBtn = document.createElement('button');
    guideBtn.type = 'button';
    guideBtn.className = 'guide-btn';
    guideBtn.textContent = 'Guide';
    guideBtn.addEventListener('click', () => onShowGuide(trophy));
    row.append(guideBtn);

    listEl.append(row);
  }

  const earnedVisible = visible.filter((t) => earned.has(t.name)).length;
  metaEl.textContent = `Showing ${visible.length} of ${trophies.length} trophies · ${earnedVisible} earned in this view`;
  emptyNote.hidden = visible.length !== 0;
  return visible;
}
