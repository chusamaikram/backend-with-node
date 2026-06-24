import RegisterForm from "./RegisterForm";

function RegisterPage() {
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary">
            Video<span className="text-accent">Tube</span>
          </h1>
          <p className="mt-1 text-sm text-text-muted">Create your account</p>
        </div>

        <div className="bg-bg-surface border border-bg-border rounded-2xl p-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
