import { getParticipantsByContestAPI } from "@/api";
import { DynamicTable } from "@/wrapper-components";
import { useEffect, useState } from "react";

export const LeetCodePage = () => {
  const CURRENT_CONTEST = "weekly-contest-476";
  const [participants, setParticipants] = useState([]);

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

  useEffect(() => {
    (async () => {
      try {
        const res = await getParticipantsByContestAPI(CURRENT_CONTEST, 1, 25);

        setParticipants(res.data);
      } catch (err: any) {
        console.error("Failed to fetch participants:", err);
      }
    })();
  }, []);

  return <DynamicTable data={participants} config={tableConfig} />;
};
