import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "./button";

const themes: Record<string, string> = {
  Light: "",
  Dark: "dark",
  Blue: "theme-blue",
  Cyber: "theme-cyber",
  Sunset: "theme-sunset",
  "Neon Ice": "theme-neon-ice",
  "Pastel Mint": "theme-pastel-mint",
  "Gamer Purple": "theme-gamer-purple",
  Gruvbox: "theme-gruvbox",
  Solarized: "theme-solarized",
  "Vintage Paper": "theme-vintage-paper",
  Emerald: "theme-emerald",
  Midnight: "theme-midnight",
  Cappuccino: "theme-cappuccino",
};

const themeClassNames = Object.values(themes).filter(Boolean);

export function setTheme(name: string) {
  const root = document.documentElement;
  root.classList.remove(...themeClassNames);
  if (name) root.classList.add(name);
}

export const Navbar = () => {
  return (
    <nav className="h-[3.8rem] border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between relative">
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r from-primary via-secondary to-accent" />

      <span className="text-xl font-extrabold ml-3 gradient-flow">AlgoZen</span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="mr-3">
            Theme
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {Object.entries(themes).map(([label, className]) => (
            <DropdownMenuItem key={label} onClick={() => setTheme(className)}>
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};
