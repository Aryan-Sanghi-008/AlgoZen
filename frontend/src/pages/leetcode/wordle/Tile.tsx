export const Tile = ({
  letter,
  status,
  isShaking = false,
  popIn = false,
  flipDelay = 0,
}: {
  letter: string;
  status: "correct" | "present" | "absent" | "";
  isShaking?: boolean;
  popIn?: boolean;
  flipDelay?: number;
}) => {
  const isEvaluated = status !== "";
  const isFilled = letter !== "" && !isEvaluated;

  let classNames = `
    w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center 
    text-xl sm:text-2xl md:text-3xl font-extrabold uppercase rounded-md
    border-2 transition-all duration-300
  `;

  if (isShaking) {
    classNames += " animate-shake";
  }

  if (popIn && letter && !isEvaluated) {
    classNames += " animate-pop-in";
  }

  if (isEvaluated) {
    if (status === "correct") {
      classNames += ` animate-flip-in bg-[var(--tile-correct)] text-[var(--tile-on-correct)] border-[var(--tile-correct)]`;
    } else if (status === "present") {
      classNames += ` animate-flip-in bg-[var(--tile-present)] text-[var(--tile-on-present)] border-[var(--tile-present)]`;
    } else if (status === "absent") {
      classNames += ` animate-flip-in bg-[var(--tile-absent)] text-foreground border-[var(--tile-absent)]`;
    }
  } else if (isFilled) {
    classNames +=
      " bg-background text-foreground border-[var(--tile-border-muted)]";
  } else {
    classNames += " bg-background border-[var(--tile-border-muted)]";
  }

  const style = {
    animationDelay: isEvaluated ? `${flipDelay}s` : "0s",
    animationFillMode: "forwards" as const,
  };

  return (
    <div className={classNames} style={style}>
      {letter}
    </div>
  );
};
