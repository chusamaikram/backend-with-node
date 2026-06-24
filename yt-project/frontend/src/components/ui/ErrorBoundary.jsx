import { Component } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center text-center px-4">
        <p className="text-7xl mb-4">⚠️</p>
        <h1 className="text-2xl font-semibold text-text-primary">Something went wrong</h1>
        <p className="text-sm text-text-muted mt-2 max-w-sm">
          An unexpected error occurred. Try refreshing the page.
        </p>
        {this.state.error?.message && (
          <p className="mt-3 text-xs font-mono text-error bg-bg-elevated px-3 py-2 rounded-lg max-w-md break-all">
            {this.state.error.message}
          </p>
        )}
        <div className="mt-8 flex gap-3">
          <Button variant="secondary" size="md" onClick={() => window.location.reload()}>
            Refresh page
          </Button>
          <Link to="/">
            <Button variant="primary" size="md" onClick={() => this.setState({ hasError: false, error: null })}>
              Go home
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
