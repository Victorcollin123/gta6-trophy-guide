// Leonida Trophy Guide — main entry.
// Loads app/data/trophies.json, renders the checklist, the detail pane, the
// roadmap and the missables view, and keeps earned progress in localStorage.
// Fully offline: the only request the page makes is the relative fetch of
// its own data file. URL helpers for screenshots: ?demo=1 seeds 13 earned,
// ?view=roadmap|missables|checklist picks the opening tab, ?tro=<id> opens a
// trophy's guide, ?spoilers=off turns the spoiler setting off.

import { loadEarned, saveEarned, exportProgress, importProgress, seedDemoIfRequested } from './js/progress.js';
import { visibleTrophies, spoilerMasked, gradeLabel, kindLabel } from './js/filters.js';
import { renderRoadmap } from './js/roadmap.js';

const DATA_URL = 'data/trophies.json';

const listEl = document.getElementById('trophyList');
const missableListEl = document.getElementById('missableList');
const detailEl = document.getElementById('detailPane');
const resultCountEl = document.getElementById('resultCount');
const searchEl = document.getElementById('search');
const kindEl = document.getElementById('kindFilter');
const gradeEl = document.getElementById('gradeFilter');
const statusEl = document.getElementById('statusFilter');
const spoilerEl = document.getElementById('spoilerToggle');

const params = new URLSearchParams(location.search);
const demoSeed = seedDemoIfRequested();
let earned = demoSeed ?? loadEarned();
let trophies = [];
let byId = new Map();
let selectedId = null;
let currentView = 'checklist';

function trophyRow(trophy) {
  const row = document.createElement('li');
  row.className = 'trophy-row' + (earned.has(trophy.id) ? ' earned' : '') + (selectedId === trophy.id ? ' selected' : '');
  row.dataset.id = String(trophy.id);

  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(trophy.id);
  box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
  box.addEventListener('change', (event) => {
    event.stopPropagation();
    toggleEarned(trophy.id);
  });

  const middle = document.createElement('div');
  const masked = spoilerMasked(trophy, spoilerEl.checked, earned);
  const name = document.createElement('p');
  name.className = 'trophy-name';
  name.textContent = (earned.has(trophy.id) ? '✓ ' : '') + (masked ? 'Hidden trophy — earn it to reveal' : trophy.name);
  const desc = document.createElement('p');
  desc.className = 'trophy-desc';
  desc.textContent = masked ? 'Hidden until earned.' : trophy.description;
  const meta = document.createElement('p');
  meta.className = 'trophy-meta';
  meta.textContent = [
    kindLabel(trophy.kind),
    trophy.target ? `PSN target 0/${trophy.target}` : null,
    trophy.missable ? 'Possibly missable' : null,
    trophy.difficulty ? `${trophy.difficulty} difficulty` : null,
  ].filter(Boolean).join(' · ');
  middle.append(name, desc, meta);

  const right = document.createElement('div');
  right.className = 'grade-col';
  const gradeBadge = document.createElement('span');
  gradeBadge.className = `badge badge-${trophy.grade}`;
  gradeBadge.textContent = gradeLabel(trophy.grade);
  right.append(gradeBadge);
  if (trophy.hidden) {
    right.append(document.createElement('br'));
    const hiddenBadge = document.createElement('span');
    hiddenBadge.className = 'badge badge-hidden';
    hiddenBadge.textContent = 'Hidden';
    right.append(hiddenBadge);
  }
  if (trophy.missable) {
    right.append(document.createElement('br'));
    const missBadge = document.createElement('span');
    missBadge.className = 'badge badge-missable';
    missBadge.textContent = 'Missable';
    right.append(missBadge);
  }

  row.append(box, middle, right);
  row.addEventListener('click', () => selectTrophy(trophy.id));
  return row;
}

function renderChecklist() {
  const shown = visibleTrophies(trophies, {
    search: searchEl.value,
    kind: kindEl.value,
    grade: gradeEl.value,
    status: statusEl.value,
    earned,
  });
  listEl.replaceChildren(...shown.map(trophyRow));
  resultCountEl.textContent = `Showing ${shown.length} of ${trophies.length} trophies — ${earned.size} earned.`;
}

function renderMissables() {
  const missables = trophies.filter((trophy) => trophy.missable);
  missableListEl.replaceChildren(...missables.map(trophyRow));
}

function renderProgress() {
  const total = trophies.length;
  const done = earned.size;
  const percent = total ? Math.round((done / total) * 100) : 0;
  document.getElementById('earnedCount').textContent = String(done);
  document.getElementById('progressFill').style.width = `${percent}%`;
  document.getElementById('progressSub').textContent = `${percent}% to the platinum`;
  const counts = ['platinum', 'gold', 'silver', 'bronze']
    .map((grade) => {
      const have = trophies.filter((t) => t.grade === grade && earned.has(t.id)).length;
      const all = trophies.filter((t) => t.grade === grade).length;
      return `${gradeLabel(grade)} ${have}/${all}`;
    })
    .join(' · ');
  document.getElementById('gradeCounts').textContent = counts;
}

function selectTrophy(id) {
  selectedId = id;
  const trophy = byId.get(id);
  if (!trophy) return;
  detailEl.replaceChildren();
  const heading = document.createElement('h2');
  heading.textContent = trophy.name;
  const gradeBadge = document.createElement('span');
  gradeBadge.className = `badge badge-${trophy.grade}`;
  gradeBadge.textContent = gradeLabel(trophy.grade);
  const desc = document.createElement('p');
  desc.className = 'trophy-desc';
  desc.textContent = trophy.description;
  const flags = document.createElement('p');
  flags.className = 'flag-line';
  flags.textContent = [
    kindLabel(trophy.kind),
    trophy.hidden ? 'Hidden on PlayStation until earned' : 'Visible from the start',
    trophy.target ? `PSN tracks progress to ${trophy.target}` : 'No PSN count',
    trophy.missable ? 'Possibly missable — see the Missables tab' : 'Not missable',
    `${trophy.difficulty} difficulty`,
  ].join(' · ');
  const guideHeading = document.createElement('h3');
  guideHeading.textContent = 'Guide';
  const guide = document.createElement('p');
  guide.textContent = trophy.guide;
  const sourceHeading = document.createElement('h3');
  sourceHeading.textContent = 'Sources';
  const sourceList = document.createElement('ul');
  for (const source of trophy.sources) {
    const item = document.createElement('li');
    item.textContent = source;
    sourceList.append(item);
  }
  const earnLine = document.createElement('p');
  earnLine.className = 'earn-line';
  const earnButton = document.createElement('button');
  earnButton.type = 'button';
  earnButton.textContent = earned.has(trophy.id) ? 'Mark as not earned' : 'Mark as earned';
  earnButton.addEventListener('click', () => toggleEarned(trophy.id));
  earnLine.append(earnButton);
  detailEl.append(heading, gradeBadge, desc, flags, guideHeading, guide, sourceHeading, sourceList, earnLine);
  renderChecklist();
  renderMissables();
}

function toggleEarned(id) {
  if (earned.has(id)) earned.delete(id);
  else earned.add(id);
  saveEarned(earned);
  renderProgress();
  renderChecklist();
  renderMissables();
  if (selectedId === id) selectTrophy(id);
}

function showView(view) {
  currentView = view;
  for (const tab of document.querySelectorAll('.tab')) {
    tab.classList.toggle('active', tab.dataset.view === view);
  }
  document.getElementById('view-checklist').classList.toggle('hidden', view !== 'checklist');
  document.getElementById('view-roadmap').classList.toggle('hidden', view !== 'roadmap');
  document.getElementById('view-missables').classList.toggle('hidden', view !== 'missables');
}

async function boot() {
  const response = await fetch(DATA_URL);
  const doc = await response.json();
  trophies = doc.trophies;
  byId = new Map(trophies.map((t) => [t.id, t]));

  for (const tab of document.querySelectorAll('.tab')) {
    tab.addEventListener('click', () => showView(tab.dataset.view));
  }
  for (const control of [searchEl, kindEl, gradeEl, statusEl]) {
    control.addEventListener('input', renderChecklist);
  }
  spoilerEl.addEventListener('change', () => {
    renderChecklist();
    renderMissables();
  });
  document.getElementById('exportBtn').addEventListener('click', () => exportProgress(earned));
  document.getElementById('importInput').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      earned = await importProgress(file);
      saveEarned(earned);
      renderProgress();
      renderChecklist();
      renderMissables();
    } catch (error) {
      alert(`Could not import that file: ${error.message}`);
    }
    event.target.value = '';
  });

  if (params.get('spoilers') === 'off') spoilerEl.checked = false;
  renderProgress();
  renderChecklist();
  renderMissables();
  renderRoadmap(document.getElementById('roadmapList'), byId, earned);

  const viewParam = params.get('view');
  if (viewParam === 'roadmap' || viewParam === 'missables') showView(viewParam);
  const troParam = Number(params.get('tro'));
  if (Number.isInteger(troParam) && byId.has(troParam)) selectTrophy(troParam);
}

boot();
