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
      className={`h-full border-r border-zinc-800 bg-[#0c0c0e] backdrop-blur-xl flex flex-col shadow-xl transition-all duration-300 ${
        collapsed ? "w-20" : "w-60"
      }`}
    >
      <div
        className={`flex ${collapsed ? "justify-center" : "justify-end"} p-3 relative`}
      >
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r from-violet-500/60 via-cyan-400/60 to-purple-500/60 animate-gradient" />
        <button
          onClick={toggle}
          className="p-2 rounded-lg hover:bg-zinc-800/60 transition"
        >
          <ChevronLeft
            className={`h-5 w-5 text-zinc-300 transition-transform ${
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
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all group ${
                active
                  ? "bg-linear-to-r from-violet-600/30 to-cyan-600/30 border border-violet-500/40 shadow-md"
                  : "hover:bg-zinc-800/60"
              }`}
            >
              <Icon
                className={`h-5 w-5 min-w-5 transition ${
                  active
                    ? "text-violet-300"
                    : "text-zinc-400 group-hover:text-zinc-200"
                }`}
              />

              {!collapsed && (
                <span
                  className={`text-sm font-medium transition ${
                    active
                      ? "text-violet-200"
                      : "text-zinc-400 group-hover:text-zinc-200"
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

      <div className="flex-1" />

      {!collapsed && (
        <div className="px-3 py-4 text-xs text-zinc-600">
          © AlgoZen v1.0 • Made for coders
        </div>
      )}
    </aside>
  );
};
