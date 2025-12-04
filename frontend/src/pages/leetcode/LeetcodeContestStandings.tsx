import {
  getContestUsersCount,
  getParticipantsByContestAPI,
  getUserByContestAPI,
} from "@/api";
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
  const CURRENT_CONTEST_NAME =
    contestName
      ?.split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") ?? "";

  const [participants, setParticipants] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(25);

  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(total / limit)
  );

  const tableConfig: TableConfig = {
    title: CURRENT_CONTEST_NAME + " - Standings",
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
    },
    {
      enabled: true,
      onSuccess: (res) => {
        if (!searchQuery) {
          setParticipants(res.data);
        }
      },
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

  const { refetch: fetchSearchedUsers } = useApi(
    getUserByContestAPI,
    { contest: contestName, username: searchQuery },
    {
      enabled: false,
      onSuccess: (res) => {
        setParticipants(res.data);
        setTotalPages(1);
      },
    }
  );

  useEffect(() => {
    if (!searchQuery.trim()) return;
    fetchSearchedUsers();
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery.trim() !== "") return;

    if (participantsData?.data) {
      setParticipants(participantsData.data);
      setTotalPages(Math.ceil(total / limit));
    }
  }, [searchQuery, participantsData]);

  return (
    <div className="space-y-6 min-h-fit h-auto">
      {loading ? (
        <TableSkeleton />
      ) : (
        <DynamicTable
          data={participants}
          config={tableConfig}
          onSearchSubmit={(q) => {
            setSearchQuery(q);
            console.log("Search submitted:", q);
          }}
        />
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
