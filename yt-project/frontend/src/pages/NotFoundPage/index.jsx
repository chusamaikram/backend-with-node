import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import Container from "@/layouts/Container";
import Button from "@/components/ui/Button";

function NotFoundPage() {
  return (
    <Container
      as="main"
      className="flex flex-col items-center justify-center min-h-[70vh] text-center py-12"
    >
      <p className="text-8xl font-bold text-bg-border select-none">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-text-primary">Page not found</h1>
      <p className="mt-2 text-sm text-text-muted max-w-xs">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/" className="mt-8">
        <Button variant="secondary" size="md">
          <Home size={16} aria-hidden="true" />
          Back to Home
        </Button>
      </Link>
    </Container>
  );
}

export default NotFoundPage;
