// Leonida Trophy Guide — boot: loads the trophy data, wires the tabs, filters,
// spoiler setting, progress header, detail pane, roadmap and missables views,
// and the export / import / reset controls. Everything runs offline from the
// files under app/; the only fetch is the trophy data beside this script.
import {
  exportProgress,
  importProgressFile,
  loadEarned,
  loadSettings,
  resetEarned,
  saveEarned,
  saveSettings,
  seedEarnedIfFresh,
  toggleEarned,
} from './js/store.js';
import { KIND_LABELS, KIND_ORDER, gradeCounts, nextUnearned } from './js/filters.js';
import { renderDetailPane } from './js/detail.js';
import { renderRoadmap } from './js/roadmap.js';
import { renderMissables } from './js/missables.js';
import { renderTrophyList } from './js/list.js';

const params = new URLSearchParams(location.search);
if (params.get('seed') === '13') seedEarnedIfFresh();

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
let earned = loadEarned();
const settings = loadSettings();
let spoilersOn = settings.spoilers === true || params.get('spoilers') === 'hide';
let selectedTrophy = null;

const filters = {
  kind: 'all',
  grade: 'all',
  query: '',
  earnedOnly: false,
};

const $ = (id) => document.getElementById(id);
const listEl = $('trophyList');
const metaEl = $('listMeta');
const emptyNote = $('emptyNote');
const detailPane = $('detailPane');

function renderProgress() {
  $('earnedCount').textContent = `${earned.size} of ${trophies.length}`;
  const pct = Math.round((earned.size / trophies.length) * 100);
  $('earnedPct').textContent = `${pct}%`;
  $('progressFill').style.width = `${pct}%`;
  const counts = gradeCounts(trophies, earned);
  $('gradeCounts').textContent = ['platinum', 'gold', 'silver', 'bronze']
    .map((g) => `${counts[g].earned}/${counts[g].total} ${g}`)
    .join(' · ');
  const next = nextUnearned(trophies, earned);
  $('nextUp').textContent = next
    ? `Next up: ${next.name} — ${next.description}`
    : 'Platinum earned — every trophy is yours.';
}

function renderAll() {
  renderProgress();
  renderTrophyList(listEl, metaEl, emptyNote, trophies, earned, filters, spoilersOn,
    (name) => {
      earned = toggleEarned(earned, name);
      renderAll();
    },
    (trophy) => {
      selectedTrophy = trophy;
      renderDetailPane(detailPane, trophy, earned, spoilersOn);
      detailPane.scrollIntoView({ block: 'nearest' });
    });
  renderDetailPane(detailPane, selectedTrophy, earned, spoilersOn);
  renderRoadmap($('roadmapList'), trophies, earned);
  renderMissables($('missablesList'), trophies, earned);
}

function showView(name) {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.view === name);
  });
  document.querySelectorAll('.view').forEach((view) => {
    view.classList.toggle('active', view.id === `view-${name}`);
  });
}

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    showView(tab.dataset.view);
    history.replaceState(null, '', `#/${tab.dataset.view}`);
  });
});

const kindChips = $('kindChips');
const allChip = document.createElement('button');
allChip.type = 'button';
allChip.className = 'chip active';
allChip.textContent = 'All kinds';
allChip.addEventListener('click', () => {
  filters.kind = 'all';
  kindChips.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
  allChip.classList.add('active');
  renderAll();
});
kindChips.append(allChip);
for (const kind of KIND_ORDER) {
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.className = 'chip';
  chip.textContent = KIND_LABELS[kind];
  chip.addEventListener('click', () => {
    filters.kind = kind;
    kindChips.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    renderAll();
  });
  kindChips.append(chip);
}

$('search').addEventListener('input', (event) => {
  filters.query = event.target.value;
  renderAll();
});
$('gradeFilter').addEventListener('change', (event) => {
  filters.grade = event.target.value;
  renderAll();
});
const spoilerToggle = $('spoilerToggle');
spoilerToggle.checked = spoilersOn;
spoilerToggle.addEventListener('change', () => {
  spoilersOn = spoilerToggle.checked;
  saveSettings({ ...settings, spoilers: spoilersOn });
  renderAll();
});
$('earnedOnlyToggle').addEventListener('change', (event) => {
  filters.earnedOnly = event.target.checked;
  renderAll();
});
$('exportBtn').addEventListener('click', () => exportProgress(earned));
$('importFile').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    earned = await importProgressFile(file, trophies.map((t) => t.name));
    renderAll();
  } catch (error) {
    alert(`Could not import that file: ${error.message}`);
  }
  event.target.value = '';
});
$('resetBtn').addEventListener('click', () => {
  if (confirm('Clear all earned trophies?')) {
    earned = resetEarned();
    selectedTrophy = null;
    renderAll();
  }
});

// Deep links for screenshots and sharing: #/roadmap, #/missables, #/about,
// ?trophy=<exact name> opens that trophy's guide in the detail pane.
const hashView = (location.hash || '').replace(/^#\/?/, '');
if (['checklist', 'roadmap', 'missables', 'about'].includes(hashView)) showView(hashView);
const trophyParam = params.get('trophy');
if (trophyParam) {
  const found = trophies.find((t) => t.name.toLowerCase() === trophyParam.toLowerCase());
  if (found) selectedTrophy = found;
}
renderAll();
