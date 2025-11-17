import { DynamicTable } from "@/wrapper-components/DynamicTable";

export const LeetCodePage = () => {
  const contestData = [
    {
      id: "69194fe44c9a232f67d36ac4",
      contest_name: "weekly-contest-476",
      username: "AS4rqqdZYj",
      rank: 51,
      score: 18,
      finish_time: "2025-11-16T02:47:26",
      old_rating: 1500,
      new_rating: 1894.6,
      delta_rating: 394.6,
    },
    {
      id: "69194fe44c9a232f67d36ac5",
      contest_name: "weekly-contest-476",
      username: "freeyourmind",
      rank: 52,
      score: 18,
      finish_time: "2025-11-16T02:47:53",
      old_rating: 2794.266,
      new_rating: 2807.75,
      delta_rating: 13.48,
    },
  ];

  const tableConfig = {
    title: "Contest Results",
    description: "Leaderboard data for selected contest.",

    filters: [
      { type: "text", placeholder: "Filter contestants..." },
      { type: "button", label: "Region" },
      { type: "button", label: "Rating Change" },
    ],

    columns: [
      { key: "rank", label: "Rank" },
      { key: "username", label: "Username" },
      { key: "score", label: "Score" },
      { key: "finish_time", label: "Finish Time" },
      { key: "old_rating", label: "Old Rating" },
      { key: "new_rating", label: "New Rating" },
      { key: "delta_rating", label: "Δ Rating" },
    ],
  };

  return <DynamicTable data={contestData} config={tableConfig} />;
};
