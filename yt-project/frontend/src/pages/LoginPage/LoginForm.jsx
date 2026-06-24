import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import useAuth from "@/hooks/useAuth";

function LoginForm() {
  const { login, loading } = useAuth();

  const [form, setForm]     = useState({ identifier: "", password: "" });
  const [errors, setErrors] = useState({});

  // ── Validation ──────────────────────────────────────────────────────────
  function validate() {
    const e = {};
    if (!form.identifier.trim()) e.identifier = "Username or email is required.";
    if (!form.password)          e.password   = "Password is required.";
    return e;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  }

  // ── Submit ──────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    // Detect whether input is email or username and send the correct field
    const isEmail = form.identifier.includes("@");
    const credentials = isEmail
      ? { email: form.identifier, password: form.password }
      : { username: form.identifier, password: form.password };

    await login(credentials);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4" aria-label="Sign in form">
      <Input
        label="Username or Email"
        id="identifier"
        name="identifier"
        type="text"
        autoComplete="username"
        value={form.identifier}
        onChange={handleChange}
        error={errors.identifier}
        placeholder="johndoe or john@example.com"
      />

      <Input
        label="Password"
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
        placeholder="••••••••"
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        className="w-full mt-2"
      >
        Sign In
      </Button>

      <p className="text-center text-sm text-text-muted">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="text-accent hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
