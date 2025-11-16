import type { SolutionType } from "@/types";

export const dummySolutions: Omit<SolutionType, "id" | "createdAt">[] = [
  {
    title: "Check for Duplicate Values",
    question_no: 1,
    platform: "LeetCode",
    contest_name: "Weekly Contest 300",
    description:
      "Given an array of integers, determine whether any value appears more than once. Uses hashing to detect duplicates efficiently.",
    photo_urls: [],
  },
  {
    title: "Two Sum II - Input Array Is Sorted",
    question_no: 2,
    platform: "LeetCode",
    contest_name: "Weekly Contest 300",
    description:
      "Find two numbers in a sorted array that add up to a target value. Uses the classic two-pointer pattern to achieve O(n) time.",
    photo_urls: [],
  },
  {
    title: "Number of Islands",
    question_no: 3,
    platform: "LeetCode",
    contest_name: "Weekly Contest 300",
    description:
      "Count how many connected groups of '1's (land) exist in a grid. A standard graph traversal problem solved using DFS or BFS.",
    photo_urls: [],
  },
  {
    title: "Coin Change",
    question_no: 4,
    platform: "LeetCode",
    contest_name: "Weekly Contest 300",
    description:
      "Given coin denominations and an amount, compute the minimum coins required to make that amount. Solved with dynamic programming.",
    photo_urls: [],
  },
];
