import { getContestUsersCount, getParticipantsByContestAPI } from "@/api";
import {
  DynamicTable,
  TablePagination,
  TableSkeleton,
} from "@/wrapper-components";
import { useEffect, useState } from "react";
import { useApi } from "@/hooks";
import { useParams } from "react-router-dom";
import type { TableConfig } from "@/types";

export const LeetcodeConestStandings = () => {
  const { contestName } = useParams();

  const [participants, setParticipants] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(25);

  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / limit);

  const tableConfig: TableConfig = {
    title: "Contest Results",
    description: "Leaderboard data of the contest.",

    columns: [
      { key: "rank", label: "Rank", dataType: "rank" },
      {
        key: "username",
        label: "Username",
        dataType: "hyperlink",
        hrefPrefix: "https://leetcode.com/",
      },
      { key: "score", label: "Score" },
      { key: "finish_time", label: "Finish Time", dataType: "time" },
      { key: "old_rating", label: "Old Rating", dataType: "decimal" },
      { key: "new_rating", label: "New Rating", dataType: "decimal" },
      { key: "delta_rating", label: "Δ Rating", dataType: "decimal" },
    ],
  };

  const { data: participantsData, loading } = useApi(
    getParticipantsByContestAPI,
    {
      contest: contestName,
      page,
      limit,
    }
  );

  useApi(
    getContestUsersCount,
    { contest: contestName },
    {
      enabled: total === 0,
      onSuccess: (res) => setTotal(res.data),
    }
  );

  useEffect(() => {
    if (participantsData) {
      setParticipants(participantsData.data);
    }
  }, [participantsData]);

  return (
    <div className="space-y-6 min-h-fit h-auto">
      {loading ? (
        <TableSkeleton />
      ) : (
        <DynamicTable data={participants} config={tableConfig} />
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <TablePagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};
