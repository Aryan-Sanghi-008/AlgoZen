import { getContestsCount, getLatestContestsAPI } from "@/api";
import {
  DynamicTable,
  TablePagination,
  TableSkeleton,
} from "@/wrapper-components";
import { useState, useMemo } from "react";
import { useApi } from "@/hooks";
import type { TableConfig } from "@/types";

export const LeetcodeConests = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / limit);

  const params = useMemo(() => ({ page, limit }), [page, limit]);

  const { data: contestsData, loading } = useApi(getLatestContestsAPI, params);

  const {} = useApi(
    getContestsCount,
    {},
    {
      enabled: total === 0,
      onSuccess: (res: { data: number }) => setTotal(res.data),
    }
  );

  const contests = contestsData?.data || [];

  const tableConfig: TableConfig = {
    title: `Top ${limit} Contest Results`,
    columns: [
      {
        key: "title",
        label: "Contest",
        dataType: "navigate" as const,
        externalKey: "titleSlug",
      },
      { key: "startTime", label: "Starting Time", dataType: "date" as const },
      { key: "endTime", label: "Ending Time", dataType: "date" as const },
      {
        key: "predict_time",
        label: "Prediction Timing",
        dataType: "date" as const,
      },
      {
        key: "update_time",
        label: "Update Time",
        dataType: "date" as const,
        showByDefault: false,
      },
      { key: "titleSlug", label: "TitleSlug", hidden: true },
    ],
  };

  return (
    <div className="space-y-6 min-h-fit h-auto">
      {loading ? (
        <TableSkeleton />
      ) : (
        <DynamicTable data={contests} config={tableConfig} />
      )}

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
