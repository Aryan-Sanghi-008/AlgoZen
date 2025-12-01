// src/config/constants.ts
export const APP = {
  name: "AlgoZen",
  sidebarWidth: 260,
  navbarHeight: 64,
};

export const ROUTES = [
  {
    name: "Rank Checker",
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
