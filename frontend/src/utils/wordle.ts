export const computeFeedback = (
  secret: string,
  guess: string
): ("correct" | "present" | "absent")[] => {
  const s = secret.toLowerCase();
  const g = guess.toLowerCase();
  const res: ("correct" | "present" | "absent")[] = Array(g.length).fill(
    "absent"
  );
  const secretArr = s.split("");
  const used = Array(g.length).fill(false);

  // first pass: correct
  for (let i = 0; i < g.length; i++) {
    if (g[i] === secretArr[i]) {
      res[i] = "correct";
      secretArr[i] = ""; // consume
      used[i] = true;
    }
  }

  // second pass: present
  for (let i = 0; i < g.length; i++) {
    if (res[i] === "correct") continue;
    const idx = secretArr.indexOf(g[i]);
    if (idx !== -1) {
      res[i] = "present";
      secretArr[idx] = ""; // consume
    }
  }

  return res;
};

// builds a map of key->best status across all revealed rows
export const computeOverallKeyStatus = (
  evals: (("correct" | "present" | "absent")[] | null)[],
  grid: string[],
) => {
  const map: Record<string, "correct" | "present" | "absent" | undefined> = {};
  for (let r = 0; r < evals.length; r++) {
    const e = evals[r];
    if (!e) continue;
    const row = grid[r] || "";
    for (let i = 0; i < row.length; i++) {
      const k = row[i].toUpperCase();
      const status = e[i];
      // priority: correct > present > absent
      if (map[k] === "correct") continue;
      if (map[k] === "present" && status === "absent") continue;
      map[k] = status;
    }
  }
  return map;
};

export const formatShare = (
  evals: (("correct" | "present" | "absent")[] | null)[],
  attempts: number,
  solution: string
) => {
  // attempts = index of current row; if solved earlier include actual attempt
  // Build emoji grid
  const lines: string[] = [];
  for (let i = 0; i < evals.length; i++) {
    const e = evals[i];
    if (!e) continue;
    lines.push(
      e
        .map((s) => (s === "correct" ? "🟩" : s === "present" ? "🟨" : "⬜"))
        .join("")
    );
  }
  const header = `Wordle Clone - ${solution ? solution.length : 5} letters\n`;
  const body = lines.join("\n");
  return `${header}${body}\n${attempts}/${evals.length}`;
};

// deterministic daily index based on date
export function seeded(seed: number) {
  // mulberry32
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getDailyWord(list: string[]) {
  const today = new Date();
  const key = today.toISOString().slice(0, 10);
  const seed = Number(key.replace(/-/g, ""));
  const rnd = seeded(seed);
  const idx = Math.floor(rnd() * list.length);
  return list[idx];
}
