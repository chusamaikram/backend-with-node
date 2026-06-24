import { createContext, useContext, useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import { getCurrentUser } from "@/api/services/user.service";

/**
 * AuthContext — carries a single flag: authChecked.
 *
 * authChecked: false → session validation still in flight, routes should not render yet.
 * authChecked: true  → validation done, routes can make trust decisions.
 */
const AuthContext = createContext({ authChecked: false });

export function useAuthStatus() {
    return useContext(AuthContext);
}

/**
 * AuthProvider — mounts once at app root, validates the session before rendering routes.
 *
 * Boot flow:
 *   isLoggedIn === true (from persisted store):
 *     → GET /users/current-user
 *       ✅ success  → re-hydrate store with fresh user data
 *       ❌ 401      → Axios interceptor fires POST /users/refresh-token (HttpOnly cookie)
 *           ✅ refresh ok  → original request retried → user hydrated
 *           ❌ refresh fail → interceptor calls clearUser() → resolves as logged out
 *   isLoggedIn === false:
 *     → skip API call, mark authChecked immediately
 */
function AuthProvider({ children }) {
    const [authChecked, setAuthChecked] = useState(false);
    const { isLoggedIn, setUser, clearUser } = useAuthStore();

    useEffect(() => {
        if (!isLoggedIn) {
            setAuthChecked(true);
            return;
        }

        getCurrentUser()
            .then((res) => {
                // Re-hydrate with fresh server data.
                // accessToken is already updated in-memory by the Axios interceptor
                // if a silent refresh happened — preserve whatever is in store now.
                setUser(res.data, useAuthStore.getState().accessToken);
            })
            .catch(() => {
                // Both accessToken and refreshToken are dead — force logout
                clearUser();
            })
            .finally(() => {
                setAuthChecked(true);
            });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <AuthContext.Provider value={{ authChecked }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
