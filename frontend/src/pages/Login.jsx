import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Leaf, LogIn } from "lucide-react";
import { isAuthenticated, login, persistSession } from "../services/authService";

const API_ENABLED = import.meta.env.VITE_USE_API !== "false";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@village.local");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (!API_ENABLED) {
        persistSession({ token: "demo-token", user: { email, role: "administrator" } });
        navigate("/dashboard", { replace: true });
        return;
      }

      const result = await login({ email, password });
      persistSession({ token: result.token, user: result.user });
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-brand">
          <span className="brand-mark"><Leaf size={18} /></span>
          <div>
            <strong>Village land <span>intelligence</span></strong>
            <small>Sign in to the workspace</small>
          </div>
        </div>
        {error && <div className="data-notice" role="alert">{error}</div>}
        <label className="login-field">
          Email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required />
        </label>
        <label className="login-field">
          Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
        </label>
        <button className="login-submit" type="submit" disabled={submitting}>
          <LogIn size={15} />
          {submitting ? "Signing in..." : "Sign in"}
        </button>
        <p className="login-hint">Use the configured account for this environment. The demo account is prefilled.</p>
      </form>
    </main>
  );
}
