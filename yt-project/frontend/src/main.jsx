import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#1a1a1a",
          color: "#f5f5f5",
          border: "1px solid #2e2e2e",
          borderRadius: "10px",
          fontSize: "14px",
        },
        success: {
          iconTheme: { primary: "#22c55e", secondary: "#1a1a1a" },
        },
        error: {
          iconTheme: { primary: "#ef4444", secondary: "#1a1a1a" },
        },
      }}
    />
  </StrictMode>
);
