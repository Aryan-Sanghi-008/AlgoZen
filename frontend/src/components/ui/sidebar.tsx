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

          const isParentActive =
            route.path === "/"
              ? pathname === "/"
              : pathname.startsWith(route.path);

          if (!route.children) {
            return (
              <Link
                key={route.name}
                to={route.path}
                className={`flex items-center gap-3 ${
                  !collapsed ? "px-3" : "px-6"
                } py-2 rounded-lg transition-all ${
                  isParentActive
                    ? "bg-sidebar-primary/30 border-sidebar-primary shadow-lg"
                    : "hover:bg-sidebar-accent/30"
                }`}
              >
                <Icon className="h-5 w-5" />
                {!collapsed && <span>{route.name}</span>}
              </Link>
            );
          }

          return (
            <div key={route.name} className="flex flex-col">
              <Link
                to={route.path}
                className={`flex items-center gap-3 ${
                  !collapsed ? "px-3" : "px-6"
                } py-2 rounded-lg transition-all ${
                  isParentActive
                    ? "bg-sidebar-primary/20 border-sidebar-primary"
                    : "hover:bg-sidebar-accent/20"
                }`}
              >
                <Icon className="h-5 w-5" />
                {!collapsed && (
                  <span className="font-medium">{route.name}</span>
                )}
              </Link>

              {!collapsed && isParentActive && (
                <div className="ml-8 mt-3 flex flex-col gap-1">
                  {route.children.map((child) => {
                    const ChildIcon = ICONS[child.icon];
                    const childActive = pathname.startsWith(child.path);

                    return (
                      <Link
                        key={child.name}
                        to={child.path}
                        className={`flex items-center gap-2 px-2 py-1 rounded-md text-sm transition ${
                          childActive
                            ? "bg-sidebar-primary/30 text-sidebar-primary"
                            : "hover:bg-sidebar-accent/30"
                        }`}
                      >
                        <ChildIcon className="h-4 w-4" />
                        <span>{child.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
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
