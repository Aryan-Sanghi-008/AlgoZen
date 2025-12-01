import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "./button";
import {
  setThemeReducer,
  type RootState,
  type ThemeName,
  useAppDispatch,
  useAppSelector,
} from "@/store";
import { useEffect } from "react";

const themes: Record<string, ThemeName> = {
  Light: "",
  Dark: "dark",
  Blue: "theme-blue",
  Sunset: "theme-sunset",
  "Neon Ice": "theme-neon-ice",
  "Pastel Mint": "theme-pastel-mint",
  Gruvbox: "theme-gruvbox",
  Solarized: "theme-solarized",
  "Vintage Paper": "theme-vintage-paper",
};

const themeClassNames = Object.values(themes).filter(Boolean);

export const setTheme = (name: string) => {
  const root = document.documentElement;
  root.classList.remove(...themeClassNames);
  if (name) root.classList.add(name);
};

export const Navbar = () => {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector(
    (state: RootState) => state.theme.current
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(...themeClassNames);
    if (currentTheme) root.classList.add(currentTheme);
  }, [currentTheme]);

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

        <DropdownMenuContent className="bg-secondary" align="end">
          {Object.entries(themes).map(([label, className]) => (
            <DropdownMenuItem
              key={label}
              onClick={() => {
                setTheme(className);
                dispatch(setThemeReducer(className));
              }}
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};
