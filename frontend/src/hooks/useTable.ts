import { useState, useMemo } from "react";

export function useTable(
  data: Record<string, unknown>[],
  columns: { key: string; label: string }[]
) {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [hiddenCols, setHiddenCols] = useState<Record<string, boolean>>({});
  const [colOrder, setColOrder] = useState<string[]>(columns.map((c) => c.key));

  const toggleSort = (key: string) => {
    if (sortCol === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortCol(key);
      setSortDir("asc");
    }
  };

  const toggleColumnVisibility = (key: string) => {
    setHiddenCols((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const reorderColumns = (newOrder: string[]) => {
    setColOrder(newOrder);
  };

  const processedData = useMemo(() => {
    let temp = [...data];

    temp = temp.filter((row) =>
      Object.entries(filters).every(([key, value]) =>
        value
          ? String(row[key] ?? "")
              .toLowerCase()
              .includes(value.toLowerCase())
          : true
      )
    );

    if (sortCol) {
      temp.sort((a, b) => {
        const va = a[sortCol];
        const vb = b[sortCol];
        if (va == null || vb == null) return 0;

        if (sortDir === "asc") return String(va).localeCompare(String(vb));
        else return String(vb).localeCompare(String(va));
      });
    }

    return temp;
  }, [data, filters, sortCol, sortDir]);

  return {
    data: processedData,
    filters,
    setFilters,
    sortCol,
    sortDir,
    toggleSort,
    hiddenCols,
    toggleColumnVisibility,
    colOrder,
    reorderColumns,
  };
}
