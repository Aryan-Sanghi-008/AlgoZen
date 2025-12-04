const rows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"],
];

export const Keyboard = ({
  onKeyPress,
  keyStates,
}: {
  onKeyPress: (k: string) => void;
  keyStates: Map<string, "correct" | "present" | "absent">;
}) => {
  const getKeyClass = (key: string) => {
    const status = keyStates.get(key);
    let baseClass = `
      rounded-md px-1 sm:px-2 py-2 sm:py-3 font-bold text-xs sm:text-sm md:text-base
      transition-all duration-150 hover:scale-105 active:scale-95
      flex items-center justify-center cursor-pointer select-none
      shadow-sm hover:shadow
    `;

    if (key === "ENTER" || key === "BACK") {
      return `${baseClass} bg-primary/20 text-primary hover:bg-primary/30`;
    }

    if (status === "correct") {
      return `${baseClass} bg-[var(--tile-correct)] text-[var(--tile-on-correct)]`;
    } else if (status === "present") {
      return `${baseClass} bg-[var(--tile-present)] text-[var(--tile-on-present)]`;
    } else if (status === "absent") {
      return `${baseClass} bg-[var(--tile-absent)] text-foreground opacity-50`;
    } else {
      return `${baseClass} bg-secondary text-secondary-foreground`;
    }
  };

  return (
    <div className="select-none w-full max-w-2xl">
      {rows.map((row, i) => (
        <div
          key={i}
          className="flex justify-center mb-1 sm:mb-2 gap-1 sm:gap-1.5"
        >
          {row.map((k) => (
            <button
              key={k}
              onClick={() => onKeyPress(k)}
              className={getKeyClass(k)}
              style={{
                minWidth:
                  k === "ENTER" ? "2.5rem" : k === "BACK" ? "2.5rem" : "2.25rem",
                minHeight: "2.5rem",
                flex: "0 0 auto",
              }}
            >
              {k === "BACK" ? (
                <span className="text-base sm:text-lg">⌫</span>
              ) : k === "ENTER" ? (
                <span className="font-semibold text-xs sm:text-sm">ENTER</span>
              ) : (
                k
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};
