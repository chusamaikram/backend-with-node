import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import useAuth from "@/hooks/useAuth";

function ForgotPasswordForm() {
  const { forgotPassword, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return setError("Email is required.");
    const ok = await forgotPassword(email.trim());
    if (ok) setSent(true);
  }

  if (sent) {
    return (
      <p className="text-center text-sm text-text-secondary">
        Check your inbox for a reset link. It expires in 15 minutes.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4" aria-label="Forgot password form">
      <Input
        label="Email"
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setError(""); }}
        error={error}
        placeholder="john@example.com"
      />

      <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
        Send Reset Link
      </Button>

      <p className="text-center text-sm text-text-muted">
        <Link to="/login" className="text-accent hover:underline font-medium">
          Back to Sign In
        </Link>
      </p>
    </form>
  );
}

export default ForgotPasswordForm;
