import {
  MoreVertical,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  GripVertical,
} from "lucide-react";

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

// ---------- Sortable Row in dropdown ----------
const SortableColumnItem = ({
  col,
  hidden,
  toggleVisibility,
}: {
  col: { key: string; label: string };
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
      className="flex items-center justify-between px-2 py-1.5 cursor-grab"
    >
      <DropdownMenuCheckboxItem
        checked={!hidden}
        onCheckedChange={toggleVisibility}
        className="flex-1"
      >
        {col.label}
      </DropdownMenuCheckboxItem>

      {/* DRAG HANDLE */}
      <GripVertical
        {...attributes}
        {...listeners}
        className="h-4 w-4 opacity-70 hover:text-primary cursor-grab active:cursor-grabbing"
      />
    </div>
  );
};

// ------------ Main Table component --------------
export const DynamicTable = ({
  data,
  config,
}: {
  data: Record<string, unknown>[];
  config: {
    title: string;
    description?: string;
    columns: { key: string; label: string }[];
  };
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

  const getSortIcon = (key: string | null) => {
    if (sortCol !== key) return <ArrowUpDown className="h-3 w-3 opacity-50" />;
    if (sortDir === "asc") return <ArrowUp className="h-3 w-3" />;
    return <ArrowDown className="h-3 w-3" />;
  };

  // ordered columns based on colOrder
  const orderedColumns = colOrder
    .map((key) => config.columns.find((c) => c.key === key)!)
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{config.title}</h1>
          <p className="text-muted-foreground">{config.description}</p>
        </div>

        {/* DROPDOWN WITH DRAGGABLE & CHECKBOX COLUMNS */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Columns</Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => {
                const { active, over } = event;
                if (!over || active.id === over.id) return;

                const oldIndex = colOrder.indexOf(String(active.id));
                const newIndex = colOrder.indexOf(String(over.id));

                // ---- CREATE NEW ORDER ----
                const newOrder = [...colOrder];
                const [moved] = newOrder.splice(oldIndex, 1);
                newOrder.splice(newIndex, 0, moved);

                // ---- CALL YOUR API ----
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

      <Table>
        <TableHeader>
          <TableRow>
            {orderedColumns.map(
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
                  </TableHead>
                )
            )}
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {processedData.map((row, idx) => (
            <TableRow key={idx}>
              {orderedColumns.map(
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
