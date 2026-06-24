import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, Upload, LogIn, X } from "lucide-react";

import useAuthStore from "@/store/authStore";
import useUiStore from "@/store/uiStore";
import useAuth from "@/hooks/useAuth";
import Avatar from "@/components/ui/Avatar";

/**
 * Navbar — fixed top bar, h-14.
 * Contains: hamburger, logo, search, upload icon, avatar/sign-in.
 */
function Navbar() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuthStore();
  const { toggleSidebar } = useUiStore();

  const [query, setQuery]               = useState("");
  const [focused, setFocused]           = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const searchRef  = useRef(null);
  const dropdownRef = useRef(null);

  /* "/" key focuses search */
  useEffect(() => {
    function onKey(e) {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" &&
          document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        searchRef.current?.blur();
        setDropdownOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    function onOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    searchRef.current?.blur();
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-14 flex items-center gap-3 px-4
                       bg-bg-surface/95 backdrop-blur-sm border-b border-bg-border">

      {/* ── Logo + hamburger ─────────────────────── */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="p-2 rounded-md text-text-secondary hover:bg-bg-elevated
                     hover:text-text-primary transition-colors duration-150"
        >
          <Menu size={20} aria-hidden="true" />
        </button>

        <Link to="/" className="flex items-center select-none" aria-label="VideoTube home">
          <span className="text-[17px] font-bold tracking-tight text-text-primary">
            Video<span className="text-accent">Tube</span>
          </span>
        </Link>
      </div>

      {/* ── Search ───────────────────────────────── */}
      <form
        onSubmit={handleSearch}
        role="search"
        className="flex-1 max-w-lg mx-auto"
      >
        <div className="relative">
          <Search
            size={15}
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search"
            aria-label="Search videos"
            className="w-full h-9 pl-9 pr-8 text-sm rounded-full
                       bg-bg-elevated border border-bg-border
                       text-text-primary placeholder:text-text-muted
                       focus:outline-none focus:border-accent
                       transition-colors duration-150"
          />
          {query ? (
            <button
              type="button"
              onClick={() => { setQuery(""); searchRef.current?.focus(); }}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2
                         text-text-muted hover:text-text-primary transition-colors"
            >
              <X size={13} aria-hidden="true" />
            </button>
          ) : (
            !focused && (
              <kbd aria-hidden="true"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden md:flex
                           items-center px-1.5 py-0.5 rounded border border-bg-border
                           text-[10px] font-mono text-text-muted pointer-events-none">
                /
              </kbd>
            )
          )}
        </div>
      </form>

      {/* ── Right actions ────────────────────────── */}
      <nav aria-label="User actions" className="flex items-center gap-1 shrink-0">
        {isLoggedIn ? (
          <>
            <Link
              to="/upload"
              aria-label="Upload video"
              className="p-2 rounded-md text-text-secondary hover:bg-bg-elevated
                         hover:text-text-primary transition-colors duration-150"
            >
              <Upload size={20} aria-hidden="true" />
            </Link>

            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen((p) => !p)}
                aria-label="User menu"
                aria-expanded={dropdownOpen}
                aria-haspopup="menu"
                className="rounded-full focus-visible:ring-2 focus-visible:ring-accent ml-1"
              >
                <Avatar
                  src={user?.avatar}
                  alt={user?.fullname}
                  fallback={user?.username?.[0] ?? "U"}
                  size="sm"
                />
              </button>

              {dropdownOpen && (
                <AvatarDropdown user={user} onClose={() => setDropdownOpen(false)} />
              )}
            </div>
          </>
        ) : (
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium
                       rounded-md bg-bg-elevated border border-bg-border
                       text-text-primary hover:bg-bg-border transition-colors duration-150"
          >
            <LogIn size={15} aria-hidden="true" />
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}

/* ── Avatar Dropdown ────────────────────────────────────────── */
function AvatarDropdown({ user, onClose }) {
  const { logout } = useAuth();
  const links = [
    { label: "Your Channel", to: `/channel/${user?.username}` },
    { label: "Dashboard",    to: "/dashboard" },
    { label: "Settings",     to: "/settings" },
  ];

  async function handleLogout() {
    onClose();
    await logout(); // calls API, clears store, redirects to /login
  }

  return (
    <div
      role="menu"
      className="absolute right-0 top-full mt-2 w-52 z-50
                 rounded-xl bg-bg-surface border border-bg-border shadow-2xl
                 py-1 overflow-hidden"
    >
      {/* User info header */}
      <div className="px-4 py-3 border-b border-bg-border">
        <p className="text-sm font-semibold text-text-primary truncate">{user?.fullname}</p>
        <p className="text-xs text-text-muted truncate">@{user?.username}</p>
      </div>

      {links.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          role="menuitem"
          onClick={onClose}
          className="flex px-4 py-2.5 text-sm text-text-secondary
                     hover:bg-bg-elevated hover:text-text-primary transition-colors duration-150"
        >
          {item.label}
        </Link>
      ))}

      <div className="border-t border-bg-border mt-1 pt-1">
        <button
          role="menuitem"
          onClick={handleLogout}
          className="w-full text-left px-4 py-2.5 text-sm text-error
                     hover:bg-error/10 transition-colors duration-150"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

export default Navbar;
