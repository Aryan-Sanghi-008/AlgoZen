import { Layout } from "@/components/ui";
import {
  LeetcodeConests,
  LeetcodeConestStandings,
  NegativeScreen,
  Solutions,
} from "@/pages";
import { Game } from "@/pages/leetcode/wordle/Wordle";
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <NegativeScreen />,
    children: [
      {
        index: true,
        element: <Game />,
      },
      {
        path: "solutions",
        element: <Solutions />,
      },
      {
        path: "contests",
        children: [
          {
            index: true,
            element: <Navigate to="leetcode" replace />,
          },
          {
            path: "leetcode",
            element: <LeetcodeConests />,
          },
          {
            path: "leetcode/:contestName",
            element: <LeetcodeConestStandings />,
          },
        ],
      },
      {
        path: "*",
        element: <NegativeScreen />,
      },
    ],
  },

  {
    path: "*",
    element: <NegativeScreen />,
  },
];
