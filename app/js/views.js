// views.js — renders the checklist, the trophy detail pane and missables.
//
// Every row shows the official name, description and grade, the kind, the
// PSN target where PlayStation tracks one, and the missable flag. The detail
// pane shows the guide in our own words with its sources named beside it.

import { displayDescription, displayName, spoilerMasks } from "./filters.js";
import { gradeLabel } from "./data.js";

export function renderChecklist(list, trophies, state, onToggle, onSelect, selectedId) {
  list.innerHTML = "";
  for (const trophy of trophies) {
    const row = document.createElement("li");
    row.className = "trophy-row grade-" + trophy.grade;
    if (state.earned.includes(trophy.name)) row.classList.add("is-earned");
    if (trophy.id === selectedId) row.classList.add("is-selected");

    const check = document.createElement("input");
    check.type = "checkbox";
    check.className = "trophy-check";
    check.checked = state.earned.includes(trophy.name);
    check.setAttribute("aria-label", `Earned: ${displayName(trophy, state)}`);
    check.addEventListener("change", () => onToggle(trophy));

    const body = document.createElement("button");
    body.type = "button";
    body.className = "trophy-body";
    body.addEventListener("click", () => onSelect(trophy));

    const name = document.createElement("span");
    name.className = "trophy-name";
    name.textContent = displayName(trophy, state);
    if (spoilerMasks(trophy, state)) name.classList.add("spoiler-mask");

    const desc = document.createElement("span");
    desc.className = "trophy-desc";
    desc.style.display = "block";
    desc.textContent = displayDescription(trophy, state);

    const tags = document.createElement("span");
    tags.className = "trophy-tags";
    const gradeTag = document.createElement("span");
    gradeTag.className = `tag grade-${trophy.grade}`;
    const dot = document.createElement("span");
    dot.className = "grade-dot";
    gradeTag.append(dot, document.createTextNode(gradeLabel(trophy.grade)));
    tags.appendChild(gradeTag);
    const kindTag = document.createElement("span");
    kindTag.className = "tag";
    kindTag.textContent = trophy.kind;
    tags.appendChild(kindTag);
    if (trophy.hidden) {
      const hiddenTag = document.createElement("span");
      hiddenTag.className = "tag tag-hidden";
      hiddenTag.textContent = "Hidden";
      tags.appendChild(hiddenTag);
    }
    if (trophy.missable) {
      const missTag = document.createElement("span");
      missTag.className = "tag tag-missable";
      missTag.textContent = "Missable";
      tags.appendChild(missTag);
    }
    if (typeof trophy.target === "number") {
      const targetTag = document.createElement("span");
      targetTag.className = "tag tag-target";
      targetTag.textContent = `PSN target: ${trophy.target}`;
      tags.appendChild(targetTag);
    }

    body.append(name, desc, tags);
    row.append(check, body);
    list.appendChild(row);
  }
}

export function renderDetail(pane, trophy, state) {
  pane.innerHTML = "";
  if (!trophy) {
    const empty = document.createElement("p");
    empty.className = "detail-empty";
    empty.textContent = "Pick any trophy in the checklist to see its guide, its sources, its difficulty hint and whether it can be missed.";
    pane.appendChild(empty);
    return;
  }
  const masked = spoilerMasks(trophy, state);
  const title = document.createElement("h2");
  title.textContent = masked ? "Hidden trophy" : trophy.name;
  const desc = document.createElement("p");
  desc.className = "detail-desc";
  desc.textContent = masked
    ? "This trophy is hidden on PlayStation until you earn it. Earn it in the checklist to reveal its name, description and guide."
    : trophy.description;

  const meta = document.createElement("div");
  meta.className = "detail-meta";
  const gradeTag = document.createElement("span");
  gradeTag.className = `tag grade-${trophy.grade}`;
  gradeTag.textContent = gradeLabel(trophy.grade);
  meta.appendChild(gradeTag);
  const kindTag = document.createElement("span");
  kindTag.className = "tag";
  kindTag.textContent = trophy.kind;
  meta.appendChild(kindTag);
  if (trophy.hidden) {
    const tag = document.createElement("span");
    tag.className = "tag tag-hidden";
    tag.textContent = "Hidden";
    meta.appendChild(tag);
  }
  if (typeof trophy.target === "number") {
    const tag = document.createElement("span");
    tag.className = "tag tag-target";
    tag.textContent = `PSN target: ${trophy.target}`;
    meta.appendChild(tag);
  }

  const flag = document.createElement("p");
  flag.className = trophy.missable ? "detail-flag" : "detail-flag safe";
  flag.textContent = trophy.missable
    ? "Possibly missable — protect it with a manual save."
    : "Not missable — it can be earned after the story.";

  pane.append(title, desc, meta, flag);
  if (masked) return;

  const guideHead = document.createElement("h4");
  guideHead.textContent = "Guide";
  const guide = document.createElement("div");
  guide.className = "detail-guide";
  const guideText = document.createElement("p");
  guideText.textContent = trophy.guide;
  guide.appendChild(guideText);

  const hintHead = document.createElement("h4");
  hintHead.textContent = "Difficulty hint";
  const hint = document.createElement("div");
  hint.className = "detail-hint";
  const hintText = document.createElement("p");
  hintText.textContent = trophy.difficulty;
  hint.appendChild(hintText);

  const sourcesHead = document.createElement("h4");
  sourcesHead.textContent = "Sources";
  const sources = document.createElement("div");
  sources.className = "detail-sources";
  const sourceList = document.createElement("ul");
  for (const source of trophy.sources) {
    const item = document.createElement("li");
    item.textContent = source;
    sourceList.appendChild(item);
  }
  sources.appendChild(sourceList);

  pane.append(guideHead, guide, hintHead, hint, sourcesHead, sources);
}

export function renderMissables(container, trophies) {
  container.innerHTML = "";
  const missables = trophies.filter((t) => t.missable);
  for (const trophy of missables) {
    const card = document.createElement("article");
    card.className = "missable-card";
    const title = document.createElement("h3");
    title.textContent = `Missable: ${trophy.name}`;
    const desc = document.createElement("p");
    desc.textContent = trophy.description;
    const guide = document.createElement("p");
    guide.textContent = trophy.guide;
    const sources = document.createElement("p");
    sources.textContent = `Sources: ${trophy.sources.join("; ")}`;
    card.append(title, desc, guide, sources);
    container.appendChild(card);
  }
  const note = document.createElement("p");
  note.textContent = "All 54 other trophies are reported as earnable after the story with no deadline. Sources: PowerPyx, GTABase.";
  container.appendChild(note);
}
