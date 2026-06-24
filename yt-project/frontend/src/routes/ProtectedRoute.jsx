import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { useAuthStatus } from "@/providers/AuthProvider";
import Spinner from "@/components/ui/Spinner";

/**
 * ProtectedRoute — wraps any route that requires authentication.
 *
 * Waits for AuthProvider to finish validating the session before deciding
 * to render or redirect — prevents a flash-redirect on hard refresh when
 * isLoggedIn is true in localStorage but the token hasn't been verified yet.
 */
function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuthStore();
  const { authChecked } = useAuthStatus();
  const location = useLocation();

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" label="Verifying session…" />
      </div>
    );
  }

  if (!isLoggedIn) {
    const safePath = location.pathname + location.search;
    const returnTo = safePath.startsWith("/") ? safePath : "/";
    return <Navigate to="/login" state={{ returnTo }} replace />;
  }

  return children ?? <Outlet />;
}

export default ProtectedRoute;
