import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import useUiStore from "@/store/uiStore";
import { cn } from "@/utils/cn";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];
const isAuthRoute = (pathname) =>
  AUTH_ROUTES.includes(pathname) || pathname.startsWith("/reset-password/");

function AppLayout() {
  const { pathname } = useLocation();
  const { sidebarOpen, setSidebarOpen } = useUiStore();
  const mainRef = useRef(null);

  const authRoute = isAuthRoute(pathname);
  const showSidebar = !authRoute;

  /* Close sidebar overlay when navigating on mobile/tablet */
  useEffect(() => {
    if (window.innerWidth < 1024) setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  /* Page transition */
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    el.classList.remove("page-enter");
    void el.offsetWidth;
    el.classList.add("page-enter");
  }, [pathname]);

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      {!authRoute && <Navbar />}

      {showSidebar && <Sidebar />}

      <main
        ref={mainRef}
        id="main-content"
        tabIndex={-1}
        className={cn(
          "min-h-screen transition-[padding-left] duration-200 ease-in-out",
          !authRoute && "pt-14",
          showSidebar && [
            // mobile: no offset (sidebar hidden)
            // tablet: offset by icon-strip
            "sm:pl-(--sidebar-collapsed)",
            // desktop: always offset by full sidebar
            "lg:pl-(--sidebar-expanded)",
          ]
        )}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
