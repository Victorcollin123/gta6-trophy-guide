// roadmap.js — the ordered stages on the road to the platinum.
//
// Each stage is built from the official trophy descriptions alone: which
// story chapters and missions, which collectibles and counts, in what order.
// A stage is done when every trophy it names is earned.

export const ROADMAP_STAGES = [
  {
    title: "Chapter 1 — learn the map, protect the missable",
    body: "Play the opening mission Gone Fishing, then Chapter 1. Meditate at every spot you meet, starting with Lucia's balcony spot in Chapter 1 — it is the one spot reported as possibly missable, because it disappears after the chapter. Keep a manual save at the start of every chapter from here on.",
    trophies: ["Just Like Paradise", "Paradise Lost", "Positive Mental Attitude"],
  },
  {
    title: "Chapters 2–4 — finish the story, both characters playable",
    body: "Chapters 2, 3 and 4 unlock the story trophies one by one, and most of the list opens up once Jason and Lucia are both playable from Chapter 2. Play the named missions as they come — Breakfast Run, The Cartel Heist, Child's Play, Headliners, VCIA Takedown and Operation Savage Glory — and finish the stranger strands for Andy, Kenton, Billy, Randy and Tyrone as you meet them.",
    trophies: [
      "T**s Ass Drug Money", "Vice City, Baby!", "Top Of The World, Ma",
      "Trust", "Break the Bank", "Family Matters", "DWNFALL", "Hi-Jacked", "Snow Storm",
      "Road to Rehabilitation", "This Was No Boat Accident", "The Lone Rider",
      "Supply & Demand", "Spin On This!",
    ],
  },
  {
    title: "The final mission — then the world is yours",
    body: "Complete the final mission for the gold, then the whole map is open with no story left to gate anything. From here everything is clean-up: nothing else on the list has a deadline, and there is no mission replay to worry about because every remaining trophy is earned in free roam.",
    trophies: ["You Gotta Know When to Get Off"],
  },
  {
    title: "Collectibles — cards, WAiNK, vehicles, regions, garages",
    body: "Three collectible card sets, WAiNK It at 100 locations, 100 vehicles discovered, all 52 regions of Leonida explored, and every garage property bought. Sweep them region by region so nothing is left for a second pass, and keep the meditation spots finished from stage one.",
    trophies: ["Don't Touch My Deck", "You WAiNKer!", "Whip It Good", "The Goodtime State", "Little Boxes"],
  },
  {
    title: "Activities — races, ranges, stunts, challenges",
    body: "Try each of the 9 activity types once, win 20 different races and a Top Fun drone race at every one of the 14 locations, earn gold in all 42 Shooting Range challenges, complete 250 stunts, finish 50 challenges, and beat Cal in a fishing challenge. The 8 stranger mission strands and Bret's unique-animal hunt finish here too.",
    trophies: [
      "Master of None", "Top Fun", "Earn Cash, Not Kudos", "The Shootist",
      "Cunning Stunts", "One Last Thing", "Baited My Tackle", "Stick Fiddler",
      "Strangers & Freaks", "Fair Game",
    ],
  },
  {
    title: "Partner play and robberies — wanted levels and vaults",
    body: "With your partner, lose a 4-star wanted level and rob 3 shops back-to-back without losing the heat. Then the robbery set: 5 of the 8 bank vaults, an armored truck, a jewelry store without being detected, and one illegal operation belonging to each of the 9 gangs. Vaults open with an optional Chapter 4 mission and always bring 4 stars, so have a fast bike ready.",
    trophies: [
      "Hot Together", "Retail Therapy", "Maximum Withdrawal",
      "A Classic Blitz Play", "Sneakthief", "Pest Control",
    ],
  },
  {
    title: "The long grinds — money, choices, and the 100%",
    body: "The last stretch is the slowest: launder $250,000 in Marked Bills, spend $100,000 across all shops, register 10 vehicles to the Scooter Bros app, and make 500 choices. Finish the in-game 100% completion checklist — it appears under Progress, Stats, after the story, but earlier progress counts — and the platinum is yours.",
    trophies: [
      "Dime on the Dollar", "Treat Yo Self", "On the Spot", "Actions Speak Louder",
      "Gunslinger", "Catch Me If You Can", "Challenging Tank", "In The Beginning…",
      "Capital Offense", "Let’s Go Bowling", "Personal Best", "Bad Luck, I Guess",
      "The Truth Is Out There", "Ten Pin", "A Long Road", "Vice Got a Price!",
    ],
  },
];

export function stageIsDone(stage, state) {
  return stage.trophies.every((name) => state.earned.includes(name));
}

export function renderRoadmap(container, state) {
  container.innerHTML = "";
  for (const stage of ROADMAP_STAGES) {
    const item = document.createElement("li");
    item.className = "roadmap-step" + (stageIsDone(stage, state) ? " is-done" : "");
    const doneCount = stage.trophies.filter((n) => state.earned.includes(n)).length;
    const title = document.createElement("h3");
    title.textContent = stage.title;
    const body = document.createElement("p");
    body.textContent = stage.body;
    const names = document.createElement("p");
    names.className = "stage-trophies";
    names.textContent = `${doneCount}/${stage.trophies.length} earned — ${stage.trophies.join(" · ")}`;
    item.append(title, body, names);
    container.appendChild(item);
  }
}
