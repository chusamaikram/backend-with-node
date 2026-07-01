import { createBrowserRouter } from "react-router-dom";

import AppLayout from "@/layouts/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

// ── Pages (folder/index.jsx pattern) ───────────────────────────────────
import HomePage           from "@/pages/HomePage";
import LoginPage          from "@/pages/LoginPage";
import RegisterPage       from "@/pages/RegisterPage";
import VideoPage          from "@/pages/VideoPage";
import SearchPage         from "@/pages/SearchPage";
import ChannelPage        from "@/pages/ChannelPage";
import SubscriptionsPage  from "@/pages/SubscriptionsPage";
import LikedVideosPage    from "@/pages/LikedVideosPage";
import WatchHistoryPage   from "@/pages/WatchHistoryPage";
import TweetsPage         from "@/pages/TweetsPage";
import PlaylistsPage      from "@/pages/PlaylistsPage";
import PlaylistDetailPage from "@/pages/PlaylistDetailPage";
import UploadVideoPage    from "@/pages/UploadVideoPage";
import DashboardPage      from "@/pages/DashboardPage";
import SettingsPage       from "@/pages/SettingsPage";
import NotFoundPage       from "@/pages/NotFoundPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage  from "@/pages/ResetPasswordPage";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [

      // ── Public ────────────────────────────────────────
      { index: true,                  element: <HomePage /> },
      { path: "watch/:videoId",       element: <VideoPage /> },
      { path: "search",               element: <SearchPage /> },
      { path: "channel/:username",    element: <ChannelPage /> },

      // ── Guest-only (redirect logged-in users away) ────
      {
        path: "login",
        element: <GuestRoute><LoginPage /></GuestRoute>,
      },
      {
        path: "register",
        element: <GuestRoute><RegisterPage /></GuestRoute>,
      },
      {
        path: "forgot-password",
        element: <GuestRoute><ForgotPasswordPage /></GuestRoute>,
      },
      {
        path: "reset-password/:token",
        element: <GuestRoute><ResetPasswordPage /></GuestRoute>,
      },

      // ── Protected (redirect logged-out users to /login) ─
      {
        element: <ProtectedRoute />,
        children: [
          { path: "subscriptions",              element: <SubscriptionsPage /> },
          { path: "liked",                      element: <LikedVideosPage /> },
          { path: "history",                    element: <WatchHistoryPage /> },
          { path: "tweets",                     element: <TweetsPage /> },
          { path: "playlists",                  element: <PlaylistsPage /> },
          { path: "playlists/:playlistId",      element: <PlaylistDetailPage /> },
          { path: "upload",                     element: <UploadVideoPage /> },
          { path: "dashboard",                  element: <DashboardPage /> },
          { path: "settings",                   element: <SettingsPage /> },
          { path: "settings/:tab",              element: <SettingsPage /> },
        ],
      },

      // ── 404 ───────────────────────────────────────────
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default router;
