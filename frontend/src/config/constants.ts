// src/config/constants.ts
export const APP = {
  name: "AlgoZen",
  sidebarWidth: 260,
  navbarHeight: 64,
};

export const ROUTES = [
  {
    name: "Wordle",
    icon: "Search",
    path: "/",
  },

  {
    name: "Solutions",
    icon: "Code",
    path: "/solutions",
  },
  {
    name: "Contests",
    icon: "Calendar",
    path: "/contests",
    children: [
      {
        name: "LeetCode",
        icon: "Code",
        path: "/contests/leetcode",
      },
    ],
  },
];

// small example list; replace with a full word list of 5-letter words (lowercase).
export const WORDS = [
  "apple",
  "bench",
  "cigar",
  "dried",
  "eagle",
  "frame",
  "greet",
  "havey",
  "index",
  "joker",
  "knife",
  "lemon",
  "mango",
  "night",
  "ocean",
  "proxy",
  "query",
  "right",
  "sword",
  "tiger",
  "urban",
  "vivid",
  "waste",
  "xenon",
  "yield",
  "zebra",
  "quack",
  "spare",
  "trunk",
  "angle",
];
