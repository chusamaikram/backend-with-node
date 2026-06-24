import { RouterProvider } from "react-router-dom";
import router from "@/routes";
import AuthProvider from "@/providers/AuthProvider";

/**
 * App root — provides the router wrapped in AuthProvider.
 * AuthProvider validates the session on boot before any route renders.
 */
function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
