import { useMemo, useState } from "react";

export type SortDirection = "asc" | "desc" | null;

export function useTable<T extends Record<string, unknown>>(
  data: T[],
  columns: readonly { key: string; label: string }[]
) {
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);

  const [filters, setFilters] = useState<Record<string, string>>({});
  const [hiddenCols, setHiddenCols] = useState<Record<string, boolean>>({});

  const toggleSort = (col: string) => {
    if (sortCol !== col) {
      setSortCol(col);
      setSortDir("asc");
      return;
    }
    if (sortDir === "asc") return setSortDir("desc");
    if (sortDir === "desc") {
      setSortCol(null);
      setSortDir(null);
      return;
    }
  };

  const toggleColumnVisibility = (col: string) => {
    setHiddenCols((prev) => ({
      ...prev,
      [col]: !prev[col],
    }));
  };

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      columns.every((c) => {
        const filterValue = filters[c.key];
        if (!filterValue) return true;
        return String(row[c.key] ?? "")
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      })
    );
  }, [data, filters, columns]);

  const sortedData = useMemo(() => {
    if (!sortCol || !sortDir) return filteredData;

    return [...filteredData].sort((a, b) => {
      const v1 = a[sortCol];
      const v2 = b[sortCol];

      if (v1 == null) return 1;
      if (v2 == null) return -1;

      if (typeof v1 === "number" && typeof v2 === "number") {
        return sortDir === "asc" ? v1 - v2 : v2 - v1;
      }

      return sortDir === "asc"
        ? String(v1).localeCompare(String(v2))
        : String(v2).localeCompare(String(v1));
    });
  }, [filteredData, sortCol, sortDir]);

  return {
    data: sortedData,
    filters,
    setFilters,
    sortCol,
    sortDir,
    toggleSort,
    hiddenCols,
    toggleColumnVisibility,
  };
}
