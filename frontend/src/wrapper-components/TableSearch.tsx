import { useState } from "react";
import { X, Search } from "lucide-react";

export const TableSearch = ({
  onSearchSubmit,
}: {
  onSearchSubmit?: (q: string) => void;
}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    if (!onSearchSubmit) return;
    onSearchSubmit(query.trim());
  };

  const clearSearch = () => {
    setQuery("");
    onSearchSubmit?.("");
  };

  return (
    <div
      className="
        flex items-center gap-2 w-full md:w-64
        rounded-xl px-3 py-2
        bg-background
        border border-border
        shadow-sm
        focus-within:ring-2 focus-within:ring-primary/30
        transition
      "
    >
      <Search className="w-4 h-4 text-muted-foreground" />

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Search username..."
        className="
          flex-1 text-sm
          bg-transparent
          placeholder:text-muted-foreground
          focus:outline-none
        "
      />

      {query && (
        <button
          onClick={clearSearch}
          className="
            text-muted-foreground hover:text-foreground
            transition
          "
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <button
        onClick={handleSubmit}
        className="
          px-3 py-1
          bg-primary text-primary-foreground
          rounded-lg text-sm
          hover:bg-primary/90
          transition
        "
      >
        Go
      </button>
    </div>
  );
};