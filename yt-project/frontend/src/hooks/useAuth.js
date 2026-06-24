import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import useAuthStore from "@/store/authStore";
import {
    loginUser,
    registerUser,
    logoutUser,
    changePassword,
} from "@/api/services/user.service";

/**
 * useAuth — single hook for all auth flows.
 *
 * login(credentials)            → POST /users/login           → store user + token → redirect
 * register(formData)            → POST /users/register        → store user + token → redirect /
 * logout()                      → POST /users/logout          → clear store        → redirect /login
 * updatePassword(old, new)      → POST /users/change-password → toast success/fail
 *
 * Security:
 *   - accessToken stored in Zustand memory only (never localStorage).
 *   - refreshToken lives in HttpOnly cookie set by backend.
 *   - isMounted ref prevents state updates on unmounted component.
 */
function useAuth() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser, clearUser } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    function getErrorMessage(err, fallback) {
        return err?.response?.data?.message ?? fallback;
    }

    // ── Login ────────────────────────────────────────────────────────────────
    async function login(credentials) {
        setLoading(true);
        try {
            const res = await loginUser(credentials);
            const { user, accessToken } = res.data;

            setUser(user, accessToken);
            toast.success(`Welcome back, ${user.fullname}!`);

            const raw = location.state?.returnTo;
            const returnTo = typeof raw === "string" && raw.startsWith("/") ? raw : "/";
            navigate(returnTo, { replace: true });
        } catch (err) {
            toast.error(getErrorMessage(err, "Login failed. Please try again."));
        } finally {
            if (isMounted.current) setLoading(false);
        }
    }

    // ── Register ─────────────────────────────────────────────────────────────
    async function register(formData) {
        setLoading(true);
        try {
            const res = await registerUser(formData);
            const { user, accessToken } = res.data;

            setUser(user, accessToken);
            toast.success("Account created! Welcome to VideoTube.");
            navigate("/", { replace: true });
        } catch (err) {
            toast.error(getErrorMessage(err, "Registration failed. Please try again."));
        } finally {
            if (isMounted.current) setLoading(false);
        }
    }

    // ── Logout ───────────────────────────────────────────────────────────────
    async function logout() {
        setLoading(true);
        try {
            await logoutUser();
        } catch {
            // Even if the API call fails, still clear local state
        } finally {
            clearUser();
            if (isMounted.current) setLoading(false);
            toast.success("Signed out.");
            navigate("/login", { replace: true });
        }
    }

    // ── Change Password ───────────────────────────────────────────────────────
    async function updatePassword(oldPassword, newPassword) {
        setLoading(true);
        try {
            await changePassword({ oldPassword, newPassword });
            toast.success("Password changed successfully.");
            return true;
        } catch (err) {
            toast.error(getErrorMessage(err, "Failed to change password."));
            return false;
        } finally {
            if (isMounted.current) setLoading(false);
        }
    }

    return { login, register, logout, updatePassword, loading };
}

export default useAuth;
