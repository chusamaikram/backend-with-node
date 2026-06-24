import { NavLink } from "react-router-dom";
import {
  Home, PlayCircle, Heart, Clock,
  Feather, ListVideo, BarChart2, Settings,
} from "lucide-react";

import useAuthStore from "@/store/authStore";
import useUiStore from "@/store/uiStore";
import Avatar from "@/components/ui/Avatar";
import { cn } from "@/utils/cn";


const NAV_ITEMS = [
  { label: "Home",           href: "/",              icon: Home       },
  { label: "Subscriptions",  href: "/subscriptions", icon: PlayCircle },
  { type: "divider" },
  { label: "Liked Videos",   href: "/liked",         icon: Heart      },
  { label: "Watch History",  href: "/history",       icon: Clock      },
  { label: "Your Tweets",    href: "/tweets",        icon: Feather    },
  { label: "Playlists",      href: "/playlists",     icon: ListVideo  },
  { type: "divider" },
  { label: "Dashboard",      href: "/dashboard",     icon: BarChart2  },
  { label: "Settings",       href: "/settings",      icon: Settings   },
];

/**
 * Sidebar — fixed below the navbar.
 *
 * Desktop: 240px (expanded) or 72px (collapsed, icon-only).
 * Mobile:  full overlay panel, dismissed by backdrop click.
 */
function Sidebar() {
  const { isLoggedIn, user } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useUiStore();

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 top-14 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        aria-label="Main navigation"
        className={cn(
          "fixed top-14 left-0 bottom-0 z-40 flex flex-col",
          "bg-bg-base border-r border-bg-border",
          "transition-[width] duration-200 ease-in-out overflow-hidden",
          sidebarOpen
            ? "w-(--sidebar-expanded)"
            : "w-0 lg:w-(--sidebar-collapsed)"
        )}
      >
        {/* ── Nav links ─────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2">
          <ul role="list" className="flex flex-col px-2 gap-0.5">
            {NAV_ITEMS.map((item, i) => {
              if (item.type === "divider") {
                return (
                  <li key={`div-${i}`} role="separator" aria-hidden="true">
                    <hr className="my-2 border-bg-border" />
                  </li>
                );
              }
              return (
                <li key={item.href}>
                  <NavItem item={item} expanded={sidebarOpen} />
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── Bottom user strip (logged-in + expanded only) ─ */}
        {isLoggedIn && sidebarOpen && (
          <div className="shrink-0 border-t border-bg-border p-3">
            <NavLink
              to={`/channel/${user?.username}`}
              className="flex items-center gap-3 rounded-lg p-2
                         hover:bg-bg-elevated transition-colors duration-150"
            >
              <Avatar
                src={user?.avatar}
                alt={user?.fullname}
                fallback={user?.username?.[0] ?? "U"}
                size="sm"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user?.fullname}
                </p>
                <p className="text-xs text-text-muted truncate">
                  @{user?.username}
                </p>
              </div>
            </NavLink>
          </div>
        )}
      </aside>
    </>
  );
}

/* ── Individual nav link ────────────────────────────────────── */
function NavItem({ item, expanded }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.href}
      end={item.href === "/"}
      aria-label={item.label}
      title={!expanded ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
          "transition-colors duration-150 overflow-hidden whitespace-nowrap",
          isActive
            ? "bg-accent/15 text-accent"
            : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
        )
      }
    >
      <Icon size={20} aria-hidden="true" className="shrink-0" />
      <span
        className={cn(
          "transition-opacity duration-150",
          expanded ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {item.label}
      </span>
    </NavLink>
  );
}

export default Sidebar;
