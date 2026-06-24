import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import useUiStore from "@/store/uiStore";
import { cn } from "@/utils/cn";

const NO_SIDEBAR = ["/login", "/register"];

/**
 * AppLayout — root shell.
 *
 *  ┌─────────────────────────────────┐
 *  │  Navbar  (fixed h-14)           │
 *  ├──────────┬──────────────────────┤
 *  │ Sidebar  │  <Outlet />          │
 *  │ (fixed)  │  (scrollable, pt-14) │
 *  └──────────┴──────────────────────┘
 */
function AppLayout() {
  const { pathname } = useLocation();
  const { sidebarOpen, setSidebarOpen } = useUiStore();

  const showSidebar = !NO_SIDEBAR.includes(pathname);

  /* Auto-close sidebar on mobile when navigating */
  useEffect(() => {
    if (window.innerWidth < 1024) setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <Navbar />

      {showSidebar && <Sidebar />}

      <main
        id="main-content"
        tabIndex={-1}
        className={cn(
          "pt-14 min-h-screen transition-[padding-left] duration-200 ease-in-out",
          showSidebar && (
            sidebarOpen
              ? "lg:pl-(--sidebar-expanded)"
              : "lg:pl-(--sidebar-collapsed)"
          )
        )}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
