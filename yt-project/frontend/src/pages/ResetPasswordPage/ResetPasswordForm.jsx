import { useState } from "react";
import { useParams } from "react-router-dom";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import useAuth from "@/hooks/useAuth";

function ResetPasswordForm() {
  const { token } = useParams();
  const { resetPassword, loading } = useAuth();
  const [form, setForm] = useState({ newPassword: "", confirm: "" });
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.newPassword) e.newPassword = "Password is required.";
    else if (form.newPassword.length < 6) e.newPassword = "Minimum 6 characters.";
    if (form.newPassword !== form.confirm) e.confirm = "Passwords do not match.";
    return e;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    await resetPassword(token, form.newPassword);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4" aria-label="Reset password form">
      <Input
        label="New Password"
        id="newPassword"
        name="newPassword"
        type="password"
        value={form.newPassword}
        onChange={handleChange}
        error={errors.newPassword}
        placeholder="••••••••"
      />

      <Input
        label="Confirm Password"
        id="confirm"
        name="confirm"
        type="password"
        value={form.confirm}
        onChange={handleChange}
        error={errors.confirm}
        placeholder="••••••••"
      />

      <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
        Reset Password
      </Button>
    </form>
  );
}

export default ResetPasswordForm;
