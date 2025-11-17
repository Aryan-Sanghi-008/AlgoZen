import { Link, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { ROUTES } from "@/config/constants";
import { ICONS } from "@/utils/icons";

export const Sidebar = ({
  collapsed,
  toggle,
}: {
  collapsed: boolean;
  toggle: () => void;
}) => {
  const { pathname } = useLocation();

  return (
    <aside
      className={`h-full border-r border-sidebar-border bg-sidebar backdrop-blur-xl flex flex-col shadow-xl transition-all duration-300 ${
        collapsed ? "w-20" : "w-60"
      }`}
    >
      <div
        className={`flex ${
          collapsed ? "justify-center" : "justify-end"
        } p-3 relative`}
      >

        <button
          onClick={toggle}
          className="p-2 rounded-lg hover:bg-sidebar-accent/40 transition"
        >
          <ChevronLeft
            className={`h-5 w-5 text-sidebar-foreground transition-transform ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <nav className="flex flex-col gap-2 mt-4 px-2">
        {ROUTES.map((route) => {
          const Icon = ICONS[route.icon];
          const active = pathname === route.path;

          return (
            <Link
              key={route.name}
              to={route.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all group border border-transparent ${
                active
                  ? "bg-sidebar-primary/30 border-sidebar-primary shadow-lg"
                  : "hover:bg-sidebar-accent/30"
              }`}
            >
              <Icon
                className={`h-5 w-5 min-w-5 transition ${
                  active
                    ? "text-sidebar-primary"
                    : "text-sidebar-foreground group-hover:text-foreground"
                }`}
              />

              {!collapsed && (
                <span
                  className={`text-sm font-medium transition ${
                    active
                      ? "text-sidebar-foreground"
                      : "text-sidebar-foreground group-hover:text-foreground"
                  }`}
                >
                  {route.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="flex-1" />

      {!collapsed && (
        <div className="px-3 py-4 text-xs text-muted-foreground">
          © AlgoZen v1.0 • Made for coders
        </div>
      )}
    </aside>
  );
};
