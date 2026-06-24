import { Navigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { useAuthStatus } from "@/providers/AuthProvider";
import Spinner from "@/components/ui/Spinner";

/**
 * GuestRoute — wraps routes only accessible when logged OUT (login, register).
 *
 * Waits for AuthProvider session check before redirecting — avoids a
 * flash where the login page renders briefly before the user is redirected.
 */
function GuestRoute({ children }) {
  const { isLoggedIn } = useAuthStore();
  const { authChecked } = useAuthStatus();

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" label="Loading…" />
      </div>
    );
  }

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default GuestRoute;
