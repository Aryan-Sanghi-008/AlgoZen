import { ArrowUpDown, ArrowUp, ArrowDown, GripVertical } from "lucide-react";
import {
  Button,
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

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { useTable } from "@/hooks/useTable";
import { useNavigate } from "react-router-dom";
import type { ColumnConfig, TableConfig } from "@/types";

/* ------------------ Sortable Column Item ------------------ */
const SortableColumnItem = ({
  col,
  hidden,
  toggleVisibility,
}: {
  col: ColumnConfig;
  hidden: boolean;
  toggleVisibility: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: col.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted/40 cursor-pointer transition"
    >
      <DropdownMenuCheckboxItem
        checked={!hidden}
        onCheckedChange={toggleVisibility}
        className="flex-1"
      >
        {col.label}
      </DropdownMenuCheckboxItem>

      <GripVertical
        {...attributes}
        {...listeners}
        className="h-4 w-4 opacity-60 hover:opacity-100 cursor-grab active:cursor-grabbing transition"
      />
    </div>
  );
};

/* ------------------ Skeleton Loader ------------------ */
export const TableSkeleton = () => {
  return (
    <div className="p-6 border rounded-xl bg-card/50">
      <div className="animate-pulse space-y-4">
        {[...Array(25)].map((_, i) => (
          <div key={i} className="flex gap-4">
            {[...Array(6)].map((__, j) => (
              <div key={j} className="h-8 flex-1 bg-muted/90 rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ------------------ Dynamic Table ------------------ */
export const DynamicTable = ({
  data,
  config,
}: {
  data: Record<string, unknown>[];
  config: TableConfig;
}) => {
  const {
    data: processedData,
    sortCol,
    sortDir,
    toggleSort,
    hiddenCols,
    toggleColumnVisibility,
    colOrder,
    reorderColumns,
  } = useTable(data, config.columns);

  const sensors = useSensors(useSensor(PointerSensor));
  const navigate = useNavigate();

  // Helper to parse date
  const parseDate = (v: any) => {
    const date = new Date(v);
    if (isNaN(date.getTime())) return null;
    return date;
  };

  /* ------------------ Format Cell Value ------------------ */
  const formatCellValue = (
    value: any,
    col: ColumnConfig,
    row?: Record<string, any>
  ): React.ReactNode => {
    if (col.render) return col.render(value, row);
    if (value == null) return "--";

    switch (col.dataType) {
      case "string":
        return String(value);

      case "decimal":
        return typeof value === "number" && !Number.isInteger(value)
          ? value.toFixed(2)
          : value;

      case "rank":
        return `#${value}`;

      case "number":
        return parseInt(value);

      case "date": {
        const date = parseDate(value);
        if (!date) return String(value);

        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yyyy = date.getFullYear();
        const hh = String(date.getHours()).padStart(2, "0");
        const min = String(date.getMinutes()).padStart(2, "0");
        const ss = String(date.getSeconds()).padStart(2, "0");

        return `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
      }

      case "time": {
        const date = parseDate(value);
        if (!date) return String(value);

        const hh = String(date.getHours()).padStart(2, "0");
        const min = String(date.getMinutes()).padStart(2, "0");
        const ss = String(date.getSeconds()).padStart(2, "0");
        return `${hh}:${min}:${ss}`;
      }

      case "hyperlink":
        if (!col.hrefPrefix) return String(value);
        return (
          <a
            href={`${col.hrefPrefix}${encodeURIComponent(String(value))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-chart-3 underline underline-offset-2 cursor-pointer"
          >
            {String(value)}
          </a>
        );

      case "navigate":
        const extValue = row && col.externalKey ? row[col.externalKey] : null;
        return (
          <p
            onClick={() => navigate(extValue ?? String(value))}
            className="text-primary hover:text-chart-3 hover:underline underline-offset-2 cursor-pointer"
          >
            {String(value)}
          </p>
        );

      default:
        return String(value);
    }
  };

  /* ------------------ Sort Icon ------------------ */
  const getSortIcon = (key: string | null) => {
    if (sortCol !== key) return <ArrowUpDown className="h-3 w-3 opacity-50" />;
    if (sortDir === "asc") return <ArrowUp className="h-3 w-3" />;
    return <ArrowDown className="h-3 w-3" />;
  };

  const orderedColumns = colOrder
    .map((key) => config.columns.find((c) => c.key === key)!)
    .filter(Boolean)
    .filter((col) => !col.hidden); // completely hidden columns removed

  return (
    <div className="space-y-6 p-6 rounded-2xl border bg-card/50 shadow-lg backdrop-blur-md w-full h-fit">
      {/* ---------------- Header ---------------- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{config.title}</h1>
          <p className="text-muted-foreground">{config.description}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="rounded-lg bg-background/60 hover:bg-muted/40 transition"
            >
              Columns
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 bg-secondary rounded-xl p-1 shadow-md"
          >
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => {
                const { active, over } = event;
                if (!over || active.id === over.id) return;

                const oldIndex = colOrder.indexOf(String(active.id));
                const newIndex = colOrder.indexOf(String(over.id));

                const newOrder = [...colOrder];
                const [moved] = newOrder.splice(oldIndex, 1);
                newOrder.splice(newIndex, 0, moved);

                reorderColumns(newOrder);
              }}
            >
              <SortableContext
                items={colOrder}
                strategy={verticalListSortingStrategy}
              >
                {orderedColumns.map((col) => (
                  <SortableColumnItem
                    key={col.key}
                    col={col}
                    hidden={!!hiddenCols[col.key]}
                    toggleVisibility={() => toggleColumnVisibility(col.key)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ---------------- Table ---------------- */}
      <div className="overflow-auto rounded-xl border bg-background/40 backdrop-blur-sm">
        <Table className="rounded-xl overflow-hidden shadow-sm">
          <TableHeader className="sticky top-0 bg-background/80 backdrop-blur-md shadow-sm">
            <TableRow>
              {orderedColumns.map(
                (col) =>
                  !hiddenCols[col.key] && (
                    <TableHead
                      key={col.key}
                      className="py-3 px-4 text-sm font-semibold text-muted-foreground 
                      whitespace-nowrap hover:text-foreground transition-colors cursor-pointer"
                      onClick={() => toggleSort(col.key)}
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        {getSortIcon(col.key)}
                      </div>
                    </TableHead>
                  )
              )}
            </TableRow>
          </TableHeader>

          <TableBody className="[&>tr:nth-child(even)]:bg-muted/50">
            {processedData.map((row, idx) => (
              <TableRow
                key={idx}
                className="border-b border-border/60 last:border-0 hover:bg-muted/50 transition-colors"
              >
                {orderedColumns.map(
                  (col) =>
                    !hiddenCols[col.key] && (
                      <TableCell
                        key={col.key}
                        className="py-3 px-4 text-sm whitespace-nowrap"
                      >
                        {formatCellValue(row[col.key], col, row)}
                      </TableCell>
                    )
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
