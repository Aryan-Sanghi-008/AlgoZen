import type { RouteObject } from "react-router-dom";
import Solutions from "@/pages/Solutions";
import UpcomingContests from "@/pages/UpcomingContests";
import { RankChecker } from "@/pages/RankChecker";
import { ContestStandings } from "@/pages/leetcode/ContestStandings";
import { Layout } from "@/components/ui";
import { Contests } from "@/pages/leetcode/Contests";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Contests />,
      },
      {
        path: ":contestName",
        element: <ContestStandings />,
      },
      {
        path: "solutions",
        element: <Solutions />,
      },
      {
        path: "upcoming-contests",
        element: <UpcomingContests />,
      },
      {
        path: "rank-checker",
        element: <RankChecker />,
      },
    ],
  },
];
