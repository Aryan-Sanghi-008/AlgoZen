import { Tile } from "./Tile";
type Status = "correct" | "present" | "absent";

type Props = {
  grid: string[];
  evaluations: (Status[] | null)[];
  currentRow: number;
  shakingRow?: number | null;
};

const MAX_ROWS = 6;
const WORD_LENGTH = 5;

export const Board = ({ grid, evaluations, currentRow, shakingRow }: Props) => {
  return (
    <div
      className="grid gap-1.5 p-2"
      style={{
        gridTemplateRows: `repeat(${MAX_ROWS}, 1fr)`,
        gridTemplateColumns: `repeat(${WORD_LENGTH}, 1fr)`,
        width: "min(19rem, 90vw)",
        aspectRatio: "5/6",
      }}
    >
      {grid.map((row, rowIndex) => {
        const evalRow: Status[] = (evaluations[rowIndex] ?? []) as Status[];
        const isShaking = rowIndex === shakingRow;
        const isCurrentRow = rowIndex === currentRow;

        return (
          <div
            key={rowIndex}
            className={`flex justify-center gap-1.5 ${
              isShaking ? "animate-shake" : ""
            }`}
            style={{ gridColumn: "1 / -1" }}
          >
            {Array.from({ length: WORD_LENGTH }).map((_, col) => {
              const letter = row[col] || "";
              const status: Status | "" = (evalRow[col] ?? "") as Status | "";
              const popIn = isCurrentRow && letter !== "";
              const flipDelay = col * 0.1;

              return (
                <Tile
                  key={col}
                  letter={letter}
                  status={status}
                  isShaking={isShaking}
                  popIn={popIn}
                  flipDelay={flipDelay}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
