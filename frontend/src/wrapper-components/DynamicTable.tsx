import { MoreVertical, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  Button,
  Input,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
  TableHead,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui";
import { useTable } from "@/hooks/useTable";

export const DynamicTable = ({
  data,
  config,
}: {
  data: Record<string, unknown>[];
  config: {
    title: string;
    description?: string;
    columns: { key: string; label: string }[];
    [key: string]: unknown;
  };
}) => {
  const {
    data: processedData,
    filters,
    setFilters,
    sortCol,
    sortDir,
    toggleSort,
    hiddenCols,
    toggleColumnVisibility,
  } = useTable(data, config.columns);

  const getSortIcon = (key: string | null) => {
    if (sortCol !== key) return <ArrowUpDown className="h-3 w-3 opacity-50" />;
    if (sortDir === "asc") return <ArrowUp className="h-3 w-3" />;
    return <ArrowDown className="h-3 w-3" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{config.title}</h1>
          <p className="text-muted-foreground">{config.description}</p>
        </div>
        <div className="flex justify-end mt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Columns</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {config.columns.map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.key}
                  checked={!hiddenCols[col.key]}
                  onCheckedChange={() => toggleColumnVisibility(col.key)}
                >
                  {col.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {config.columns.map(
              (col) =>
                !hiddenCols[col.key] && (
                  <TableHead key={col.key} className="select-none">
                    <div
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => toggleSort(col.key)}
                    >
                      {col.label}
                      {getSortIcon(col.key)}
                    </div>
                    <Input
                      placeholder={`Filter ${col.label}`}
                      value={filters[col.key] || ""}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          [col.key]: e.target.value,
                        }))
                      }
                      className="w-40 h-7 text-sm"
                    />
                  </TableHead>
                )
            )}
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {processedData.map((row, idx) => (
            <TableRow key={idx}>
              {config.columns.map(
                (col) =>
                  !hiddenCols[col.key] && (
                    <TableCell key={col.key}>
                      {String(row[col.key] ?? "--")}
                    </TableCell>
                  )
              )}

              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
