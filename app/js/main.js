// main.js — boots the guide: loads the data, wires the toolbar, the tabs,
// the checklist and the detail pane, and keeps the address hash in step
// with the view so each screen has a link of its own.

import { loadTrophies } from "./data.js";
import { applyFilters, countByGrade } from "./filters.js";
import { renderRoadmap } from "./roadmap.js";
import { renderChecklist, renderDetail, renderMissables } from "./views.js";
import {
  earnedCount,
  exportProgress,
  isEarned,
  loadSavedProgress,
  parseImportedProgress,
  saveProgress,
  toggleEarned,
} from "./store.js";

const views = ["checklist", "roadmap", "missables"];
let trophies = [];
let state = loadSavedProgress();
let selectedId = null;
let query = { search: "", kind: "all", grade: "all", earned: "all" };

const elements = {
  list: document.getElementById("trophyList"),
  meta: document.getElementById("listMeta"),
  detail: document.getElementById("detailPane"),
  roadmap: document.getElementById("roadmapList"),
  missables: document.getElementById("missableList"),
  search: document.getElementById("searchInput"),
  kind: document.getElementById("kindFilter"),
  grade: document.getElementById("gradeFilter"),
  earned: document.getElementById("earnedFilter"),
  spoiler: document.getElementById("spoilerToggle"),
  earnedCount: document.getElementById("earnedCount"),
  progressPct: document.getElementById("progressPct"),
  progressFill: document.getElementById("progressFill"),
  gradeCounts: document.getElementById("gradeCounts"),
  saveNote: document.getElementById("saveNote"),
};

function showView(name) {
  for (const view of views) {
    document.getElementById(`${view}View`).classList.toggle("is-hidden", view !== name);
    document.getElementById(`tab${view[0].toUpperCase()}${view.slice(1)}`).classList.toggle("is-active", view === name);
  }
}

function renderProgress() {
  const earned = earnedCount(state);
  const pct = Math.round((earned / trophies.length) * 100);
  elements.earnedCount.textContent = String(earned);
  elements.progressPct.textContent = `${pct}%`;
  elements.progressFill.style.width = `${pct}%`;
  const counts = countByGrade(trophies, state);
  elements.gradeCounts.innerHTML = "";
  const parts = Object.entries(counts).map(([grade, [got, total]]) => {
    const bold = document.createElement("b");
    bold.textContent = `${got}/${total}`;
    const span = document.createElement("span");
    span.append(bold, document.createTextNode(` ${grade}`));
    return span;
  });
  parts.forEach((part, i) => {
    if (i > 0) elements.gradeCounts.appendChild(document.createTextNode(" · "));
    elements.gradeCounts.appendChild(part);
  });
}

function renderAll() {
  const visible = applyFilters(trophies, state, query);
  renderChecklist(
    elements.list,
    visible,
    state,
    (trophy) => {
      state = toggleEarned(state, trophy);
      saveProgress(state);
      renderAll();
    },
    (trophy) => {
      selectedId = trophy.id;
      location.hash = `#trophy-${trophy.id.slice("trophy-".length)}`;
      renderDetail(elements.detail, trophy, state);
      renderAll();
    },
    selectedId,
  );
  elements.meta.textContent = `Showing ${visible.length} of ${trophies.length} trophies · ${earnedCount(state)} earned`;
  renderProgress();
  renderRoadmap(elements.roadmap, state);
  renderMissables(elements.missables, trophies);
  const selected = trophies.find((t) => t.id === selectedId) ?? null;
  if (selected) renderDetail(elements.detail, selected, state);
}

function readHash() {
  const hash = location.hash.replace(/^#/, "");
  if (hash === "roadmap" || hash === "missables") {
    showView(hash);
    return;
  }
  const match = hash.match(/^trophy-(\d+)$/);
  if (match) {
    const trophy = trophies[Number(match[1]) - 1];
    if (trophy) {
      selectedId = trophy.id;
      showView("checklist");
      renderDetail(elements.detail, trophy, state);
      return;
    }
  }
  showView("checklist");
}

function wireToolbar() {
  elements.search.addEventListener("input", () => {
    query.search = elements.search.value;
    renderAll();
  });
  elements.kind.addEventListener("change", () => {
    query.kind = elements.kind.value;
    renderAll();
  });
  elements.grade.addEventListener("change", () => {
    query.grade = elements.grade.value;
    renderAll();
  });
  elements.earned.addEventListener("change", () => {
    query.earned = elements.earned.value;
    renderAll();
  });
  elements.spoiler.checked = state.spoilerHidden;
  elements.spoiler.addEventListener("change", () => {
    state = { ...state, spoilerHidden: elements.spoiler.checked };
    saveProgress(state);
    renderAll();
  });
  document.getElementById("exportBtn").addEventListener("click", () => {
    const count = exportProgress(state, trophies);
    elements.saveNote.textContent = `Exported ${count} earned trophies to leonida-trophy-progress.json.`;
  });
  document.getElementById("importBtn").addEventListener("click", () => {
    document.getElementById("importFile").click();
  });
  document.getElementById("importFile").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const imported = parseImportedProgress(await file.text(), trophies);
      state = { ...state, earned: imported };
      saveProgress(state);
      renderAll();
      elements.saveNote.textContent = `Imported ${imported.length} earned trophies from ${file.name}.`;
    } catch {
      elements.saveNote.textContent = "That file could not be imported — it is not a progress export from this guide.";
    }
    event.target.value = "";
  });
  document.getElementById("resetBtn").addEventListener("click", () => {
    if (!window.confirm("Clear all earned trophies? This cannot be undone.")) return;
    state = { ...state, earned: [] };
    saveProgress(state);
    renderAll();
    elements.saveNote.textContent = "Progress reset.";
  });
  for (const view of views) {
    document.getElementById(`tab${view[0].toUpperCase()}${view.slice(1)}`).addEventListener("click", () => {
      location.hash = view === "checklist" ? "#checklist" : `#${view}`;
    });
  }
  window.addEventListener("hashchange", readHash);
}

async function bootGuide() {
  trophies = await loadTrophies();
  wireToolbar();
  readHash();
  renderAll();
}

bootGuide().catch((error) => {
  elements.list.innerHTML = `<li class="trophy-row">The trophy list could not be loaded: ${error.message}</li>`;
});
