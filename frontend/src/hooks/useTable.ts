import type { ColumnConfig } from "@/types";
import { useState, useMemo } from "react";

export function useTable(
  data: Record<string, unknown>[],
  columns: ColumnConfig[]
) {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Initialize hiddenCols based on showByDefault & hidden
  const initialHiddenCols = columns.reduce((acc, col) => {
    if (!col.hidden) {
      acc[col.key] = col.showByDefault === false; // hidden if showByDefault=false
    }
    return acc;
  }, {} as Record<string, boolean>);

  const [hiddenCols, setHiddenCols] =
    useState<Record<string, boolean>>(initialHiddenCols);

  // Only include columns that are not permanently hidden
  const initialColOrder = columns.filter((c) => !c.hidden).map((c) => c.key);
  const [colOrder, setColOrder] = useState<string[]>(initialColOrder);

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

    // Apply filters
    temp = temp.filter((row) =>
      Object.entries(filters).every(([key, value]) =>
        value
          ? String(row[key] ?? "")
              .toLowerCase()
              .includes(value.toLowerCase())
          : true
      )
    );

    // Apply sorting
    if (sortCol) {
      temp.sort((a, b) => {
        const va = a[sortCol];
        const vb = b[sortCol];

        if (va == null || vb == null) return 0;

        const na = Number(va);
        const nb = Number(vb);
        const bothNumbers = !isNaN(na) && !isNaN(nb);

        if (bothNumbers) return sortDir === "asc" ? na - nb : nb - na;

        const sa = String(va).toLowerCase();
        const sb = String(vb).toLowerCase();
        return sortDir === "asc" ? sa.localeCompare(sb) : sb.localeCompare(sa);
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
