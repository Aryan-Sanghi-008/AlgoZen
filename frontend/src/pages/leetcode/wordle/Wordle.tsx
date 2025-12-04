import { useEffect, useState, useCallback } from "react";
import { Board } from "./WordleBoard";
import { Keyboard } from "./Keyboard";
import { computeFeedback, getDailyWord } from "@/utils";

const MAX_ROWS = 6;
const WORD_LENGTH = 5;
const STORAGE_KEY = "wordle_clone_v2";
const FLIP_DURATION = 500;

const makeEmptyGrid = () => Array.from({ length: MAX_ROWS }, () => "");

export const Game = () => {
  const [shakingRow, setShakingRow] = useState<number | null>(null);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [messageType, setMessageType] = useState<"info" | "success" | "error">(
    "info"
  );
  const todayKey = `wordle_${new Date().toISOString().slice(0, 10)}`;

  const wordleListRaw = localStorage.getItem("wordle_word_list") || "";
  const validWords = wordleListRaw.match(/.{1,5}/g) || [];
  const solution = getDailyWord(validWords);

  const loadInitialState = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      if (parsed?.dateKey === todayKey) {
        return parsed;
      }
    } catch {}
    return null;
  };

  const savedState = loadInitialState();

  const [grid, setGrid] = useState<string[]>(() => {
    return savedState?.grid || makeEmptyGrid();
  });

  const [evaluations, setEvaluations] = useState<
    (("correct" | "present" | "absent")[] | null)[]
  >(() => {
    return savedState?.evaluations || Array(MAX_ROWS).fill(null);
  });

  const [currentRow, setCurrentRow] = useState(() => {
    if (savedState?.currentRow !== undefined) {
      return Math.min(savedState.currentRow, MAX_ROWS - 1);
    }
    const idx = grid.findIndex((row) => row.length < WORD_LENGTH);
    return idx === -1 ? 0 : idx;
  });

  const [message, setMessage] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);

  const isFinished = evaluations.some((evaluation, index) => {
    if (!evaluation) return false;
    return (
      evaluation.every((status) => status === "correct") ||
      (index === MAX_ROWS - 1 && grid[index].length === WORD_LENGTH)
    );
  });

  useEffect(() => {
    const state = {
      dateKey: todayKey,
      grid,
      evaluations,
      currentRow,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [grid, evaluations, currentRow, todayKey]);

  const showMessage = useCallback(
    (msg: string, type: "info" | "success" | "error" = "info") => {
      setMessage(msg);
      setMessageType(type);

      setTimeout(
        () => {
          setMessage(null);
          setMessageType("info");
        },
        type === "error" ? 2000 : 2500
      );
    },
    []
  );

  const onKey = useCallback(
    (key: string) => {
      if (isFinished || animating) return;

      const guess = grid[currentRow] || "";

      if (key === "ENTER") {
        if (guess.length < WORD_LENGTH) {
          setShakingRow(currentRow);
          showMessage("Not enough letters", "error");
          setTimeout(() => setShakingRow(null), 300);
          return;
        }

        const word = guess.toLowerCase();
        const validSet = new Set(validWords);

        if (!validSet.has(word)) {
          setShakingRow(currentRow);
          showMessage("Not in word list", "error");
          setTimeout(() => setShakingRow(null), 300);
          return;
        }

        const feedback = computeFeedback(solution, guess);
        setEvaluations((prev) =>
          prev.map((e, i) => (i === currentRow ? feedback : e))
        );

        setAnimating(true);

        const totalAnimationTime =
          FLIP_DURATION + (WORD_LENGTH - 1) * 100 + 300;

        setTimeout(() => {
          setAnimating(false);

          if (word === solution) {
            setShowWinAnimation(true);
            showMessage("🎉 Congratulations! You won! 🎉", "success");
            setTimeout(() => setShowWinAnimation(false), 1000);
          } else if (currentRow === MAX_ROWS - 1) {
            showMessage(
              `Game Over! The word was: ${solution.toUpperCase()}`,
              "info"
            );
          } else {
            setCurrentRow((prev) => prev + 1);
          }
        }, totalAnimationTime);

        return;
      }

      if (key === "BACK") {
        const next = guess.slice(0, -1);
        setGrid((prev) =>
          prev.map((row, i) => (i === currentRow ? next : row))
        );
        return;
      }

      if (/^[A-Z]$/.test(key) && guess.length < WORD_LENGTH) {
        const next = guess + key;
        setGrid((prev) =>
          prev.map((row, i) => (i === currentRow ? next : row))
        );
        return;
      }
    },
    [grid, currentRow, isFinished, animating, solution, validWords, showMessage]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      e.stopPropagation();
      if (
        e.key === "Enter" ||
        e.key === "Backspace" ||
        /^[a-zA-Z]$/.test(e.key)
      ) {
        e.preventDefault();
      }

      if (e.key === "Enter") onKey("ENTER");
      else if (e.key === "Backspace") onKey("BACK");
      else if (/^[a-zA-Z]$/.test(e.key)) onKey(e.key.toUpperCase());
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onKey]);

  const keyStates = evaluations.reduce((acc, row, rowIndex) => {
    if (!row) return acc;
    const currentGuess = grid[rowIndex] || "";

    row.forEach((status, colIndex) => {
      const char = currentGuess[colIndex]?.toUpperCase();
      if (!char) return;

      const existingStatus = acc.get(char);

      if (
        !existingStatus ||
        (existingStatus === "absent" && status !== "absent") ||
        (existingStatus === "present" && status === "correct")
      ) {
        acc.set(char, status);
      }
    });

    return acc;
  }, new Map<string, "correct" | "present" | "absent">());

  return (
    <div className="flex flex-col items-center gap-4 relative overflow-hidden">
      {/* FLOATING NOTIFICATION STYLE */}
      {message && (
        <div
          className={`
      fixed top-4 left-1/2 transform -translate-x-1/2 z-50
      px-6 py-4 rounded-2xl text-base font-semibold
      animate-fade-in-out backdrop-blur-xl
      flex items-center justify-center gap-3
      shadow-2xl border
      min-w-76
      ${
        messageType === "success"
          ? "bg-linear-to-r from-(--tile-correct)/90 to-(--tile-correct)/70 text-(--tile-on-correct) border-(--tile-correct)/30"
          : messageType === "error"
          ? "bg-linear-to-r from-(--destructive)/90 to-(--destructive)/70 text-white border-(--destructive)/30"
          : "bg-linear-to-r from-(--primary)/90 to-(--primary)/70 text-primary-foreground border-(--primary)/30"
      }
    `}
        >
          {/* Animated circle icon */}
          <div
            className={`relative w-8 h-8 rounded-full flex items-center justify-center ${
              messageType === "success"
                ? "bg-white/20"
                : messageType === "error"
                ? "bg-white/20"
                : "bg-white/10"
            }`}
          >
            {messageType === "success" && (
              <span className="text-lg animate-bounce">✓</span>
            )}
            {messageType === "error" && <span className="text-lg">✕</span>}
            {messageType === "info" && <span className="text-lg">i</span>}

            {/* Pulsing ring effect */}
            <div
              className={`absolute inset-0 rounded-full border-2 animate-ping ${
                messageType === "success"
                  ? "border-(--tile-on-correct)/30"
                  : messageType === "error"
                  ? "border-white/30"
                  : "border-(--primary-foreground)/30"
              }`}
            />
          </div>

          <div className="flex-1 text-center">
            <div className="font-bold tracking-wide drop-shadow-sm">
              {message}
            </div>
          </div>
        </div>
      )}

      {/* WIN CONFETTI ANIMATION */}
      {showWinAnimation && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: [
                  "var(--tile-correct)",
                  "var(--tile-present)",
                  "var(--primary)",
                  "var(--accent)",
                ][i % 4],
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8 w-full max-w-6xl px-2 md:px-4">
        {/* LEFT SIDEBAR - LEGEND */}
        <div className="w-full md:w-72 lg:w-80 order-2 md:order-1">
          <div className="bg-card border-2 border-border rounded-xl p-4 md:p-6 shadow-lg">
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-center flex items-center justify-center gap-2">
              <span className="text-xl md:text-2xl">🧩</span>
              How to Play
            </h3>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-3 p-2 md:p-3 rounded-lg bg-secondary/50">
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-(--tile-correct) text-(--tile-on-correct) font-bold rounded-lg border-2 border-(--tile-correct) text-base md:text-lg shadow">
                  W
                </div>
                <div className="flex-1">
                  <p className="font-bold text-primary text-sm md:text-base">
                    Correct Spot
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Letter is in the right position
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 md:p-3 rounded-lg bg-secondary/50">
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-(--tile-present) text-(--tile-on-present) font-bold rounded-lg border-2 border-(--tile-present) text-base md:text-lg shadow">
                  E
                </div>
                <div className="flex-1">
                  <p className="font-bold text-primary text-sm md:text-base">
                    Wrong Spot
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Letter is in the word but wrong position
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 md:p-3 rounded-lg bg-secondary/50">
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-(--tile-absent) text-foreground font-bold rounded-lg border-2 border-(--tile-border-muted) text-base md:text-lg shadow">
                  R
                </div>
                <div className="flex-1">
                  <p className="font-bold text-primary text-sm md:text-base">
                    Not in Word
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Letter is not in the word at all
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-border">
              <div className="flex justify-between text-xs md:text-sm">
                <div className="text-center">
                  <div className="font-bold text-base md:text-lg">
                    {MAX_ROWS}
                  </div>
                  <div className="text-muted-foreground">Attempts</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-base md:text-lg">
                    {WORD_LENGTH}
                  </div>
                  <div className="text-muted-foreground">Letters</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-base md:text-lg">1</div>
                  <div className="text-muted-foreground">Word/Day</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GAME AREA */}
        <div className="flex flex-col items-center gap-4 md:gap-6 flex-1 order-1 md:order-2">
          {/* TITLE */}
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-1 md:mb-2 bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              WORDLE
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Guess the hidden word in {MAX_ROWS} tries
            </p>
          </div>

          {/* BOARD */}
          <div className="scale-90 md:scale-100">
            <Board
              grid={grid}
              evaluations={evaluations}
              currentRow={currentRow}
              shakingRow={shakingRow}
            />
          </div>

          {/* KEYBOARD */}
          <div className="ml-20 scale-90 md:scale-100 w-full">
            <Keyboard onKeyPress={onKey} keyStates={keyStates} />
          </div>

          {/* GAME STATS */}
          <div className="flex items-center justify-between w-full max-w-md px-2 text-xs md:text-sm">
            <div className="text-muted-foreground">
              {!isFinished
                ? `Attempt ${currentRow + 1} of ${MAX_ROWS}`
                : "Game Complete"}
            </div>
            <div className="text-muted-foreground">Daily Puzzle</div>
          </div>
        </div>
      </div>
    </div>
  );
};
