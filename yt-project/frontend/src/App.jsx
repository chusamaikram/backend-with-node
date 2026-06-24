import { RouterProvider } from "react-router-dom";
import router from "@/routes";
import AuthProvider from "@/providers/AuthProvider";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
